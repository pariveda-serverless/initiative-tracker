import { ActionPayload, Message } from 'slack';
import { ThankYouResponse } from '../slack-messages/thank-you';

export async function remainMemberAction(teamId: string, channel: string, payload: ActionPayload): Promise<Message> {
  return new ThankYouResponse(channel);
}
