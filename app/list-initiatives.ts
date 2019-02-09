import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse } from './initiative';
import { SlackListResponse } from './slack-components/list-response';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ success, error }: ApiSignature) => {
  try {
    const initiatives = await getInitiatives();
    const message = new SlackListResponse(initiatives);
    success(message);
  } catch (err) {
    error(err);
  }
});

async function getInitiatives(): Promise<InitiativeResponse[]> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    IndexName: process.env.INITIATIVES_TABLE_TYPE_INDEX,
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: { '#type': 'type' },
    ExpressionAttributeValues: { ':type': INITIATIVE_TYPE }
  };
  console.log('Getting all initiatives with params', params);
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => {
      console.log(res);
      return res;
    })
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiatives', records);
  return records.map(initiative => new InitiativeResponse(initiative));
}
