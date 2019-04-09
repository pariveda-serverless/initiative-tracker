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
  console.log(payload.actions && payload.actions.length > 0);
  if (payload.actions && payload.actions.length > 0) {
    console.log(payload.actions[0].selected_option.value);
    ({ status, office } = parseValue(payload.actions[0].selected_option.value));
    console.log(status, office);
  }
  console.log(status, office);
  const query = new Query({ status, office });
  console.log(query);
  const initiatives = await getInitiatives(teamId, query);
  return new ListResponse({ initiatives, channelId, slackUserId, query });
}
