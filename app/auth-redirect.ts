import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { get } from 'request-promise';
import { SSM } from 'aws-sdk';
import { AccessTokenResponse } from 'slack';

const ssm = new SSM({ apiVersion: '2014-11-06' });

const SLACK_OATH_URL = 'https://slack.com/api/oauth.access';

export const handler = apiWrapper(async ({ query, success, error }: ApiSignature) => {
  try {
    const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI } = process.env;
    const params = {
      url: `${SLACK_OATH_URL}?code=${
        query.code
      }&client_id=${SLACK_CLIENT_ID}&client_secret=${SLACK_CLIENT_SECRET}&redirect_uri=${SLACK_REDIRECT_URI}`,
      method: 'GET',
      simple: false
    };
    console.log('Authorizing app with params', params);
    const response: AccessTokenResponse = JSON.parse(await get(params));
    console.log('Authorizing app response', response);
    if (response.ok) {
      await saveAccessToken(response);
      success('Initiative tracker was successfully added!');
    } else {
      error('There was a problem adding initiative tracker');
    }
  } catch (err) {
    error(err);
  }
});

async function saveAccessToken(token: AccessTokenResponse): Promise<any> {
  const params = {
    Name: `/initiative-trackers/${process.env.STAGE}/teams/${token.team_id}/access-token`,
    Type: 'SecureString',
    Value: token.access_token,
    Description: `${token.team_name} Slack access token for the ${process.env.STAGE} Initiative Tracker`
  };
  return ssm.putParameter(params).promise();
}
