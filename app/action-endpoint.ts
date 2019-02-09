import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { ActionType, InitiativeIntent, MemberIntent } from './interactions';
import { CreateMemberRequest, MEMBER_TYPE, MemberResponse, DeleteMemberRequest } from './member';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse } from './initiative';
import { DetailResponse } from './slack-responses/detail-response';
import { getUserName } from './slack-calls/profile';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload);
    const { callback_id: action } = payload;
    let response: any;
    switch (action) {
      case ActionType.INITIATIVE_ACTION:
        response = await handleInitiativeActions(payload);
        break;
      case ActionType.MEMBER_ACTION:
        response = await handleMemberActions(payload);
        break;
      default:
        error('No action type specified for this action');
        break;
    }
    success(response);
  } catch (err) {
    error(err);
  }
});

async function handleMemberActions(payload: any): Promise<any> {
  const intent: MemberIntent = payload.actions[0].name;
  let response: any;
  switch (intent) {
    case MemberIntent.MAKE_CHAMPION:
      response = await changeRoleHandler(payload, true);
      break;
    case MemberIntent.MAKE_MEMBER:
      response = await changeRoleHandler(payload, false);
      break;
    case MemberIntent.REMOVE_MEMBER:
      response = await leaveInitiativeHandler(payload);
      break;
    default:
      break;
  }
}

async function handleInitiativeActions(payload: any): Promise<any> {
  const intent: InitiativeIntent = payload.actions[0].name;
  let response: any;
  switch (intent) {
    case InitiativeIntent.JOIN_AS_CHAMPION:
      response = await joinInitiativeHandler(payload, true);
      break;
    case InitiativeIntent.JOIN_AS_MEMBER:
      response = await joinInitiativeHandler(payload, false);
      break;
    case InitiativeIntent.VIEW_DETAILS:
      response = await viewDetailsHandler(payload);
      break;
    default:
      break;
  }
  return response;
}

async function joinInitiativeHandler(payload: any, champion: boolean): Promise<any> {
  const initiativeId = payload.actions[0].value;
  const slackUserId = payload.user.id;
  const name = await getUserName(slackUserId);
  const member = new CreateMemberRequest({ initiativeId, slackUserId, name, champion });
  await joinInitiative(member);
  // TODO replace with a slack response class
  return {
    text: `${member.name} is now a ${member.champion ? 'champion' : 'member'} of the initiative`,
    response_type: 'ephemeral'
  };
}

async function changeRoleHandler(payload: any, champion: boolean): Promise<any> {
  const { initiativeId, slackUserId } = JSON.parse(payload.actions[0].value);
  const name = await getUserName(slackUserId);
  const member = new CreateMemberRequest({ initiativeId, slackUserId, name, champion });
  await joinInitiative(member);
  // TODO replace with a slack response
  return {
    text: `${member.name} is now a ${member.champion ? 'champion' : 'member'} of the initiative`,
    response_type: 'ephemeral'
  };
}

async function leaveInitiativeHandler(payload: any): Promise<any> {
  const { initiativeId, slackUserId } = JSON.parse(payload.actions[0].value);
  const member = new DeleteMemberRequest({ initiativeId, slackUserId });
  await leaveInitiative(member);
  const name = await getUserName(slackUserId);
  // TODO replace with a slack response
  return {
    text: `${name} is no longer on this initiative`,
    response_type: 'ephemeral'
  };
}

function joinInitiative(Item: CreateMemberRequest): Promise<any> {
  const params = { TableName: process.env.INITIATIVES_TABLE, Item };
  console.log('Adding member to initiative with params', params);
  return initiatives.put(params).promise();
}

function leaveInitiative(Key: DeleteMemberRequest): Promise<any> {
  const params = { TableName: process.env.INITIATIVES_TABLE, Key };
  console.log('Removing member from initiative with params', params);
  return initiatives.delete(params).promise();
}

async function viewDetailsHandler(payload: any) {
  const initiativeId: string = payload.actions[0].value;
  const initiative = await getInitiativeDetails(initiativeId);
  return new DetailResponse(initiative);
}

async function getInitiativeDetails(initiativeId: string): Promise<InitiativeResponse> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId }
  };
  console.log('Getting initiative details with params', params);
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiative records', records);
  let initiative: InitiativeResponse = new InitiativeResponse(
    records.find(record => record.type.indexOf(INITIATIVE_TYPE) > -1)
  );
  initiative.members = records
    .filter(record => record.type.indexOf(MEMBER_TYPE) > -1)
    .map(record => new MemberResponse(record));
  return initiative;
}
