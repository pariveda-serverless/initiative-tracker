import { post } from 'request-promise';
import { WebClient } from '@slack/client';
import { Message } from 'slack';
import { getToken } from './profile';

const slack = new WebClient();

export async function reply(url: string, message: Message) {
  const params = {
    url,
    method: 'POST',
    simple: false,
    body: JSON.stringify(message)
  };
  console.log('Replying to message with params', JSON.stringify(params));
  const response = await post(params);
  console.log('Received response', JSON.stringify(response));
}

export async function send(message: any, teamId: string): Promise<any> {
  message.token = await getToken(teamId);
  console.log('Sending slack message', JSON.stringify(message));
  const response = await slack.chat.postMessage(message);
  console.log('Received response', JSON.stringify(response));
  return response;
}
