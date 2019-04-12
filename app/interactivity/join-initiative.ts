import { parseValue } from './id-helper';
import { DetailResponse } from '../slack-messages';
import { Message, ActionPayload } from 'slack';
import { CreateMemberRequest } from '../members';
import { getInitiativeDetails } from './get-initiative-details';
import { table } from '../shared';
import { Profile } from '../slack-api';

export async function joinInitiativeAction(
  teamId: string,
  channel: string,
  payload: ActionPayload,
  profile: Profile
): Promise<Message> {
  const { initiativeId, champion } = parseValue(payload.actions[0].value);
  const slackUserId = payload.user.id;
  await joinInitiative(teamId, initiativeId, slackUserId, champion, profile);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return new DetailResponse({ initiative, slackUserId, channel });
}

export async function joinInitiative(
  teamId: string,
  initiativeId: string,
  slackUserId: string,
  champion: boolean,
  profile: Profile
): Promise<any> {
  const member = new CreateMemberRequest({ teamId, initiativeId, slackUserId, champion, profile });
  const params = { TableName: process.env.INITIATIVES_TABLE, Item: member };
  console.log('Adding member to initiative with params', params);
  await table.put(params).promise();
}
