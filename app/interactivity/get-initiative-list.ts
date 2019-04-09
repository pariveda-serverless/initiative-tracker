import { ActionPayload, Message } from 'slack';
import { ListResponse } from '../slack-messages';
import { getInitiatives } from '../slash-commands/list-initiatives';
import { Query } from '../queries';

export async function getInitiativeListAction(
  teamId: string,
  channelId: string,
  payload: ActionPayload
): Promise<Message> {
  const slackUserId = payload.user.id;
  const query = new Query({});
  const initiatives = await getInitiatives(teamId, query);
  return new ListResponse({ initiatives, channelId, slackUserId, query });
}
