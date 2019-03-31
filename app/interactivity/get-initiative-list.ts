import { ActionPayload, Message } from 'slack';
import { ListResponse } from '../slack-messages';
import { getInitiatives, getQuery } from '../slash-commands/list-initiatives';

export async function getInitiativeListAction(
  teamId: string,
  channelId: string,
  queryId: string,
  payload: ActionPayload
): Promise<Message> {
  const { status, isPublic } = await getQuery(queryId);
  const slackUserId = payload.user.id;
  const initiatives = await getInitiatives(teamId);
  return new ListResponse({ initiatives, channelId, slackUserId, isPublic, status });
}
