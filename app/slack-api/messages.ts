import { post } from 'request-promise';
import { WebClient } from '@slack/client';
import { SSM } from 'aws-sdk';
import { Message } from 'slack';
import { getAccessTokenParameterPath } from '../app-authorization/auth-redirect';

const slack = new WebClient();
const ssm = new SSM({ apiVersion: '2014-11-06' });

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

async function getToken(teamId: string): Promise<string> {
  const params = {
    Name: getAccessTokenParameterPath(teamId),
    WithDecryption: true
  };
  console.log('Getting access token with params', params);
  return ssm
    .getParameter(params)
    .promise()
    .then(res => res.Parameter.Value);
}

export async function send(message: any, teamId: string): Promise<any> {
  message.token = await getToken(teamId);
  console.log('Sending slack message', JSON.stringify(message));
  const response = await slack.chat.postMessage(message);
  console.log('Received response', JSON.stringify(response));
  return response;
}
