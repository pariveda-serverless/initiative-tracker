import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { DetailResponse } from '../slack-messages';
import { joinInitiative } from './join-initiative';

export async function addMemberAction(teamId: string, channel: string, payload: ActionPayload): Promise<Message> {
  const { slackUserId } = payload.submission;
  const { initiativeId } = parseValue(payload.state);
  await joinInitiative(teamId, initiativeId, slackUserId, false);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return new DetailResponse(initiative, slackUserId, channel);
}
