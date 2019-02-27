import { post } from 'request-promise';
import { WebClient } from '@slack/client';
import { Dialog } from 'slack';
import { getToken } from './profile';

const slack = new WebClient();

export async function sendDialogue(teamId: string, message: any) {
  // const params = {
  //   url,
  //   method: 'POST',
  //   simple: false,
  //   body: JSON.stringify({ dialog: message})
  // };
  message.token = await getToken(teamId);
  console.log('Replying to message with params', JSON.stringify(message));
  const response = await slack.dialog.open(message);
  console.log('Received response', JSON.stringify(response));
}