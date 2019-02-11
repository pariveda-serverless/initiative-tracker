import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { ActionType, InitiativeIntent, MemberIntent } from './interactions';
import { CreateMemberRequest, MEMBER_TYPE, MemberResponse, DeleteMemberRequest } from './member';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse } from './initiative';
import { DetailResponse } from './slack-responses/detail-response';
import { getUserProfile } from './slack-calls/profile';
import { NotImplementedResponse } from './slack-responses/not-implemented-response';

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
        response = new NotImplementedResponse();
        break;
    }
    success(response);
  } catch (err) {
    error(err);
  }
});

async function handleMemberActions(payload: any): Promise<any> {
  const intent: MemberIntent = payload.actions[0].name;
  const { initiativeId, slackUserId } = JSON.parse(payload.actions[0].value);
  let response: any;
  switch (intent) {
    case MemberIntent.MAKE_CHAMPION:
      await joinInitiativeHandler(initiativeId, slackUserId, true);
      response = await getInitiativeDetails(initiativeId);
      break;
    case MemberIntent.MAKE_MEMBER:
      await joinInitiativeHandler(initiativeId, slackUserId, false);
      response = await getInitiativeDetails(initiativeId);
      break;
    case MemberIntent.REMOVE_MEMBER:
      await leaveInitiativeHandler(payload);
      response = await getInitiativeDetails(initiativeId);
      break;
    default:
      response = new NotImplementedResponse();
      break;
  }
  return response;
}

async function handleInitiativeActions(payload: any): Promise<any> {
  const intent: InitiativeIntent = payload.actions[0].name;
  const initiativeId = payload.actions[0].value;
  const slackUserId = payload.user.id;
  let response: any;
  switch (intent) {
    case InitiativeIntent.JOIN_AS_CHAMPION:
      await joinInitiativeHandler(initiativeId, slackUserId, true);
      response = await getInitiativeDetails(initiativeId);
      break;
    case InitiativeIntent.JOIN_AS_MEMBER:
      await joinInitiativeHandler(initiativeId, slackUserId, false);
      response = await getInitiativeDetails(initiativeId);
      break;
    case InitiativeIntent.VIEW_DETAILS:
      response = await getInitiativeDetails(initiativeId);
      break;
    default:
      response = new NotImplementedResponse();
      break;
  }
  return response;
}

async function joinInitiativeHandler(initiativeId: string, slackUserId: string, champion: boolean): Promise<any> {
  const { name, icon } = await getUserProfile(slackUserId);
  const member = new CreateMemberRequest({ initiativeId, slackUserId, name, champion, icon });
  await joinInitiative(member);
}

async function leaveInitiativeHandler(payload: any): Promise<any> {
  const { initiativeId, slackUserId } = JSON.parse(payload.actions[0].value);
  const member = new DeleteMemberRequest({ initiativeId, slackUserId });
  await leaveInitiative(member);
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

async function getInitiativeDetails(initiativeId: string): Promise<DetailResponse> {
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
  return new DetailResponse(initiative);
}
