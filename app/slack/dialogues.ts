import { post } from 'request-promise';
import { WebClient } from '@slack/client';
import { Dialog } from 'slack';
import { getToken } from './profile';
import {
  EditInitiativeFieldValidator
} from '../slack-responses/edit-initiative-dialogue-response';

const slack = new WebClient();

export async function sendDialogue(teamId: string, message: any) {
  const token = await getToken(teamId);
  message.token = token;
  console.log('Opening dialog with params', JSON.stringify(message));
  const response = await slack.dialog.open(message);
  console.log('Received response', JSON.stringify(response));
}

export async function dialogErrorReply(url: string, message: EditInitiativeFieldValidator) {
  const params = {
    url,
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    simple: false,
    body: JSON.stringify(message)
  };
  console.log('Replying to message with params', JSON.stringify(params));
  const response = await post(params);
  console.log('Received response', JSON.stringify(response));
}