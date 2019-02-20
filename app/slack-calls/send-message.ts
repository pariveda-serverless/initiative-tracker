import { post } from 'request-promise';
import { Message } from 'slack';

export async function send(url: string, message: Message) {
  const params = {
    url,
    method: 'POST',
    simple: false,
    body: JSON.stringify(message)
  };
  console.log('Replying to message with params', JSON.stringify(params));
  const response = await post(params);
  console.log('Received response', response);
}
