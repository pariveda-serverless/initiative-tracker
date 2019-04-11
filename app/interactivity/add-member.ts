import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { DetailResponse } from '../slack-messages';
import { joinInitiative } from './join-initiative';
import { Profile } from '../slack-api';

export async function addMemberAction(
  teamId: string,
  channel: string,
  payload: ActionPayload,
  profile: Profile
): Promise<{ response: Message; responseUrl: string }> {
  const { slackUserId, role } = payload.submission;
  const { champion } = parseValue(role);
  const { initiativeId, responseUrl } = parseValue(payload.state);
  await joinInitiative(teamId, initiativeId, slackUserId, champion, profile);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return { response: new DetailResponse({ initiative, slackUserId, channel }), responseUrl };
}
