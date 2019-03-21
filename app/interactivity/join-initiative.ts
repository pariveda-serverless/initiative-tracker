import { parseValue } from './id-helper';
import { DetailResponse } from '../slack-messages';
import { Message, ActionPayload } from 'slack';
import { getUserProfile } from '../slack-api';
import { CreateMemberRequest } from '../members';
import { getInitiativeDetails } from './get-initiative-details';
import { initiativesTable } from '../shared';

export async function joinInitiativeAction(teamId: string, channel: string, payload: ActionPayload): Promise<Message> {
  const { initiativeId, champion } = parseValue(payload.actions[0].value);
  const slackUserId = payload.user.id;
  await joinInitiative(teamId, initiativeId, slackUserId, champion);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return new DetailResponse(initiative, slackUserId, channel);
}

export async function joinInitiative(
  teamId: string,
  initiativeId: string,
  slackUserId: string,
  champion: boolean
): Promise<any> {
  const { name, icon } = await getUserProfile(slackUserId, teamId);
  const member = new CreateMemberRequest({ teamId, initiativeId, slackUserId, name, champion, icon });
  const params = { TableName: process.env.INITIATIVES_TABLE, Item: member };
  console.log('Adding member to initiative with params', params);
  await initiativesTable.put(params).promise();
}
