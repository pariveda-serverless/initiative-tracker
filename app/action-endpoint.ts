import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Message, Payload } from 'slack';
import { InitiativeAction, MemberAction, StatusUpdateAction } from './interactions';
import {
  CreateMemberRequest,
  MEMBER_TYPE,
  MemberResponse,
  DeleteMemberRequest,
  getTeamIdentifier,
  getMemberIdentifiers
} from './member';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse, Status, getInitiativeIdentifiers } from './initiative';
import { DetailResponse } from './slack-responses/detail-response';
import { getUserProfile } from './slack/profile';
import { NotImplementedResponse } from './slack-responses/not-implemented-response';
import { reply } from './slack/messages';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const payload: Payload = JSON.parse(body.payload);
    const teamId = payload.team.id;
    const responseUrl = payload.response_url;
    const channel = payload.channel.id;
    const action = payload.actions[0].action_id;
    let response: Message;
    switch (action) {
      case InitiativeAction.JOIN_AS_MEMBER:
      case InitiativeAction.JOIN_AS_CHAMPION: {
        const { initiativeId, champion } = JSON.parse(payload.actions[0].value);
        const slackUserId = payload.user.id;
        await joinInitiative(teamId, initiativeId, slackUserId, champion);
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        break;
      }
      case InitiativeAction.VIEW_DETAILS: {
        const { initiativeId } = JSON.parse(payload.actions[0].value);
        const slackUserId = payload.user.id;
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        break;
      }
      case MemberAction.MAKE_CHAMPION: {
        const { initiativeId, slackUserId } = JSON.parse(payload.actions[0].value);
        await changeMembership(initiativeId, teamId, slackUserId, true);
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        break;
      }
      case MemberAction.MAKE_MEMBER: {
        const { initiativeId, slackUserId } = JSON.parse(payload.actions[0].value);
        await changeMembership(initiativeId, teamId, slackUserId, false);
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        break;
      }
      case MemberAction.REMOVE_MEMBER: {
        const { initiativeId, slackUserId } = JSON.parse(payload.actions[0].value);
        await leaveInitiative(initiativeId, teamId, slackUserId);
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        break;
      }
      case MemberAction.UPDATE_MEMBERSHIP: {
        const { id, userId, champion, remove } = JSON.parse(payload.actions[0].selected_option.value);
        if (remove) {
          await leaveInitiative(id, teamId, userId);
        } else {
          await changeMembership(id, teamId, userId, champion);
        }
        const initiative = await getInitiativeDetails(teamId, id);
        response = new DetailResponse(initiative, userId, channel);
        break;
      }
      case InitiativeAction.UPDATE_STATUS:
      case StatusUpdateAction.MARK_ON_HOLD:
      case StatusUpdateAction.MARK_ABANDONED:
      case StatusUpdateAction.MARK_COMPLETE:
      case StatusUpdateAction.MARK_ACTIVE: {
        const value = payload.actions[0].value ? payload.actions[0].value : payload.actions[0].selected_option.value;
        const { initiativeId, status } = JSON.parse(value);
        const slackUserId = payload.user.id;
        await updateInitiativeStatus(initiativeId, teamId, status);
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        break;
      }
      default: {
        response = new NotImplementedResponse(channel);
        break;
      }
    }
    await reply(responseUrl, response);
    success();
  } catch (err) {
    error(err);
  }
});

async function updateInitiativeStatus(initiativeId: string, teamId: string, status: Status): Promise<any> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getInitiativeIdentifiers(teamId) },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status }
  };
  console.log('Updating initiative status with params', params);
  await initiatives.update(params).promise();
}

async function joinInitiative(
  teamId: string,
  initiativeId: string,
  slackUserId: string,
  champion: boolean
): Promise<any> {
  const { name, icon } = await getUserProfile(slackUserId, teamId);
  const member = new CreateMemberRequest({ teamId, initiativeId, slackUserId, name, champion, icon });
  const params = { TableName: process.env.INITIATIVES_TABLE, Item: member };
  console.log('Adding member to initiative with params', params);
  await initiatives.put(params).promise();
}

async function changeMembership(
  initiativeId: string,
  teamId: string,
  slackUserId: string,
  champion: boolean
): Promise<any> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getMemberIdentifiers(teamId, slackUserId) },
    UpdateExpression: 'set #champion = :champion',
    ExpressionAttributeNames: { '#champion': 'champion' },
    ExpressionAttributeValues: { ':champion': champion }
  };
  console.log('Updating membership type with params', params);
  await initiatives.update(params).promise();
}

function leaveInitiative(initiativeId: string, teamId: string, slackUserId: string): Promise<any> {
  const Key = new DeleteMemberRequest({ initiativeId, teamId, slackUserId });
  const params = { TableName: process.env.INITIATIVES_TABLE, Key };
  console.log('Removing member from initiative with params', params);
  return initiatives.delete(params).promise();
}

async function getInitiativeDetails(teamId: string, initiativeId: string): Promise<InitiativeResponse> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId and begins_with(#identifiers, :identifiers)',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId', '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId, ':identifiers': getTeamIdentifier(teamId) }
  };
  console.log('Getting initiative details with params', params);
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiative records', records);
  let initiative: InitiativeResponse = new InitiativeResponse(records.find(record => record.type === INITIATIVE_TYPE));
  initiative.members = records.filter(record => record.type === MEMBER_TYPE).map(record => new MemberResponse(record));
  return initiative;
}
