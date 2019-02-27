import { post } from 'request-promise';
import { WebClient } from '@slack/client';
import { Dialog } from 'slack';
import { getToken } from './profile';

const slack = new WebClient();

export async function sendDialogue(teamId: string, triggerId: string, message: any) {
  const dialogMessage = {
    trigger_id: triggerId, 
    dialog: message,
    token: '',
  }
  dialogMessage.token = await getToken(teamId);
  console.log('Replying to message with params', JSON.stringify(dialogMessage));
  const response = await slack.dialog.open(dialogMessage);
  console.log('Received response', JSON.stringify(response));
}