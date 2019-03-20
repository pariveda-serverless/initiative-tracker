import { InitiativeResponse, InitiativeRecord, INITIATIVE_TYPE } from '../initiatives';
import { getTeamIdentifier, MEMBER_TYPE, MemberResponse } from '../members';
import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { DetailResponse } from '../slack-messages';
import { initiativesTable } from '../shared';

export async function getInitiativeDetailsAction(
  teamId: string,
  channel: string,
  payload: ActionPayload
): Promise<Message> {
  const { initiativeId } = parseValue(payload.actions[0].value);
  const slackUserId = payload.user.id;
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return new DetailResponse(initiative, slackUserId, channel);
}

export async function getInitiativeDetails(teamId: string, initiativeId: string): Promise<InitiativeResponse> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId and begins_with(#identifiers, :identifiers)',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId', '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId, ':identifiers': getTeamIdentifier(teamId) }
  };
  console.log('Getting initiative details with params', params);
  const records = await initiativesTable
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiative records', records);
  let initiative: InitiativeResponse = new InitiativeResponse(records.find(record => record.type === INITIATIVE_TYPE));
  initiative.members = records.filter(record => record.type === MEMBER_TYPE).map(record => new MemberResponse(record));
  return initiative;
}