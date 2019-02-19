import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { post } from 'request-promise';
import { InitiativeIntent, MemberIntent, ActionType } from './interactions';
import { CreateMemberRequest, MEMBER_TYPE, MemberResponse, DeleteMemberRequest } from './member';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse } from './initiative';
import { DetailResponse } from './slack-responses/detail-response';
import { getUserProfile } from './slack-calls/profile';
import { NotImplementedResponse } from './slack-responses/not-implemented-response';
import { Message, OldMessage, Payload } from 'slack';
import { Status } from './status';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const payload: Payload = JSON.parse(body.payload);
    const channel = payload.channel.id;
    const action = payload.actions[0].action_id;
    let response: Message | OldMessage;
    switch (action) {
      case InitiativeIntent.JOIN_AS_CHAMPION: {
        const { initiativeId } = JSON.parse(payload.actions[0].value);
        const slackUserId = payload.user.id;
        await joinInitiativeHandler(initiativeId, slackUserId, true);
        const initiative = await getInitiativeDetails(initiativeId);
        response = new DetailResponse(initiative, channel);
        break;
      }
      case InitiativeIntent.JOIN_AS_MEMBER: {
        const { initiativeId } = JSON.parse(payload.actions[0].value);
        const slackUserId = payload.user.id;
        await joinInitiativeHandler(initiativeId, slackUserId, false);
        const initiative = await getInitiativeDetails(initiativeId);
        response = new DetailResponse(initiative, channel);
        break;
      }
      case MemberIntent.REMOVE_MEMBER: {
        const { initiativeId, slackUserId } = JSON.parse(payload.actions[0].value);
        await leaveInitiative(initiativeId, slackUserId);
        const initiative = await getInitiativeDetails(initiativeId);
        response = new DetailResponse(initiative, channel);
        break;
      }
      case InitiativeIntent.VIEW_DETAILS: {
        const { initiativeId } = JSON.parse(payload.actions[0].value);
        const slackUserId = payload.user.id;
        const initiative = await getInitiativeDetails(initiativeId);
        response = new DetailResponse(initiative, channel);
        break;
      }
      case ActionType.STATUS_UPDATE: {
        const { initiativeId, status } = JSON.parse(payload.actions[0].value);
        const slackUserId = payload.user.id;
        await updateInitiativeStatus(initiativeId, status);
        const initiative = await getInitiativeDetails(initiativeId);
        response = new DetailResponse(initiative, channel);
      }
      default: {
        response = new NotImplementedResponse();
        break;
      }
    }
    console.log(response);
    console.log(JSON.stringify(response));
    const params = {
      url: payload.response_url,
      method: 'POST',
      simple: false,
      body: JSON.stringify(response)
    };
    await post(params);
    success();
  } catch (err) {
    error(err);
  }
});

async function updateInitiativeStatus(initiativeId: string, status: Status): Promise<any> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, type: INITIATIVE_TYPE },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status }
  };
  console.log('Updating initiative status with params', params);
  await initiatives.update(params).promise();
}

async function joinInitiativeHandler(initiativeId: string, slackUserId: string, champion: boolean): Promise<any> {
  const { name, icon } = await getUserProfile(slackUserId);
  const member = new CreateMemberRequest({ initiativeId, slackUserId, name, champion, icon });
  await joinInitiative(member);
}

function joinInitiative(Item: CreateMemberRequest): Promise<any> {
  const params = { TableName: process.env.INITIATIVES_TABLE, Item };
  console.log('Adding member to initiative with params', params);
  return initiatives.put(params).promise();
}

function leaveInitiative(initiativeId: string, slackUserId: string): Promise<any> {
  const Key = new DeleteMemberRequest({ initiativeId, slackUserId });
  const params = { TableName: process.env.INITIATIVES_TABLE, Key };
  console.log('Removing member from initiative with params', params);
  return initiatives.delete(params).promise();
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
