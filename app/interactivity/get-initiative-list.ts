import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { ListResponse } from '../slack-messages';
import { getInitiatives } from '../slash-commands/list-initiatives';

export async function getInitiativeListAction(
  teamId: string,
  channelId: string,
  payload: ActionPayload
): Promise<Message> {
  const { status, isPublic } = parseValue(payload.actions[0].value);
  const slackUserId = payload.user.id;
  const initiatives = await getInitiatives(teamId);
  return new ListResponse(initiatives, channelId, slackUserId, isPublic, status);
}
