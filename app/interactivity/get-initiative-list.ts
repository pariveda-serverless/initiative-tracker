import { ActionPayload, Message } from 'slack';
import { ListResponse } from '../slack-messages';
import { getInitiatives } from '../slash-commands/list-initiatives';
import { Query } from '../queries';
import { parseValue } from './id-helper';

export async function getInitiativeListAction(
  teamId: string,
  channelId: string,
  payload: ActionPayload
): Promise<Message> {
  const slackUserId = payload.user.id;
  let status, office;
  if (payload.actions && payload.actions.length > 0 && payload.actions[0].selected_option) {
    ({ status, office } = parseValue(payload.actions[0].selected_option.value));
  }
  const query = new Query({ status, office });
  const initiatives = await getInitiatives(teamId);
  return new ListResponse({ initiatives, channelId, slackUserId, query });
}
