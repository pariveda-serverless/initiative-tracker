import { WebClient } from '@slack/client';
import { SSM } from 'aws-sdk';
import { getAccessTokenParameterPath } from '../../app-authorization/auth-redirect';

const slack = new WebClient();
const ssm = new SSM({ apiVersion: '2014-11-06' });

export async function sendDialogue(teamId: string, message: any) {
  const token = await getToken(teamId);
  message.token = token;
  console.log('Opening dialog with params', JSON.stringify(message));
  const response = await slack.dialog.open(message);
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
