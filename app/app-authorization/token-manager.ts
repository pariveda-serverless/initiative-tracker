import { SSM } from 'aws-sdk';
import { AccessTokenResponse } from 'slack';

const ssm = new SSM({ apiVersion: '2014-11-06' });

export async function saveToken(token: AccessTokenResponse): Promise<any> {
  const params = {
    Name: getAccessTokenParameterPath(token.team_id),
    Type: 'SecureString',
    Value: token.access_token,
    Description: `${token.team_name} Slack access token for the ${process.env.STAGE} Initiative Tracker`,
    Overwrite: true
  };
  return ssm.putParameter(params).promise();
}
export async function getToken(teamId: string): Promise<string> {
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

function getAccessTokenParameterPath(teamId: string) {
  return `/initiative-trackers/${process.env.STAGE}/teams/${teamId}/access-token`;
}
