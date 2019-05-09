import { post } from 'request-promise';
import { WebClient } from '@slack/web-api';
import { Message } from 'slack';
import { getToken } from '../app-authorization';

const slack = new WebClient();

export async function replyWithMessage(url: string, message: Message) {
  const params = {
    url,
    method: 'POST',
    simple: false,
    body: JSON.stringify(message)
  };
  console.log('Replying to message with params', JSON.stringify(params));
  const response = JSON.parse(await post(params));
  if (!response.ok) {
    throw new Error(response.error);
  }
  console.log('Received response', JSON.stringify(response));
}

export async function sendMessage(message: any, teamId: string): Promise<any> {
  message.token = await getToken(teamId);
  console.log('Sending slack message', JSON.stringify(message));
  const response = await slack.chat.postMessage(message);
  if (!response.ok) {
    throw new Error(response.error);
  }
  console.log('Received response', JSON.stringify(response));
  return response;
}

export async function sendEphemeralMessage(message: any, teamId: string, userId: string): Promise<any> {
  message.token = await getToken(teamId);
  message.user = userId;
  console.log('Sending slack message', JSON.stringify(message));
  const response = await slack.chat.postEphemeral(message);
  if (!response.ok) {
    throw new Error(response.error);
  }
  console.log('Received response', JSON.stringify(response));
  return response;
}
