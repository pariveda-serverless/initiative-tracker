import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { DetailResponse } from '../slack-messages';
import { joinInitiative } from './join-initiative';
import { getQuery } from '../slash-commands/list-initiatives';

export async function addMemberAction(
  teamId: string,
  channel: string,
  payload: ActionPayload
): Promise<{ response: Message; responseUrl: string }> {
  const { slackUserId, role } = payload.submission;
  const { champion } = parseValue(role);
  const { initiativeId, queryId, responseUrl } = parseValue(payload.state);
  await joinInitiative(teamId, initiativeId, slackUserId, champion);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  const query = await getQuery(queryId);
  return { response: new DetailResponse({ initiative, slackUserId, query, channel }), responseUrl };
}
