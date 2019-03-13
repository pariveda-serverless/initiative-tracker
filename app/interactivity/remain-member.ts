import { ActionPayload, Message } from 'slack';
import { RemainMemberResponse } from '../slack-messages/remain-member';

export async function remainMemberAction(teamId: string, channel: string, payload: ActionPayload): Promise<Message> {
  return new RemainMemberResponse(channel);
}
