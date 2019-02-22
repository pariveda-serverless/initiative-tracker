import { post } from 'request-promise';
import { ActionResponse } from 'slack';

export async function send(url: string, message: ActionResponse) {
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

export async function sendDialogue(url: string, message: ActionResponse) {
  const params = {
    url,
    method: 'POST',
    simple: false,
    body: JSON.stringify({ dialog: message})
  };
  console.log('Replying to message with params', JSON.stringify(params));
  const response = await post(params);
  console.log('Received response', JSON.stringify(response));
}