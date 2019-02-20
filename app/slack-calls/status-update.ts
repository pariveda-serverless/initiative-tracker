import { WebClient } from '@slack/client';
import { StatusUpdateRequest } from '../slack-responses/status-update-request';

const slack = new WebClient(process.env.SLACK_ACCESS_TOKEN);

export async function requestStatusUpdate(message: StatusUpdateRequest): Promise<any> {
  console.log('Requesting feedback with message', JSON.stringify(message));
  const response = await slack.chat.postMessage(message);
  console.log('Received response', response);
  return response;
}
