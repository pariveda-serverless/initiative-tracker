import { WebClient, WebAPICallResult } from '@slack/client';
import { MemberResponse } from '../member';
import { InitiativeResponse } from '../initiative';

const slack = new WebClient(process.env.SLACK_ACCESS_TOKEN);

export async function requestStatusUpdate(): Promise<any> {
  const response = await slack.chat.postMessage({
    channel: 'UFS2A0EUA',
    text: 'This is a test'
  });
  console.log(response);
  return response;
}
