import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { generateInitiativeMessage } from './slack-components/initiative-message';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse } from './initiative';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const initiatives = await getInitiatives();
    console.log('INITIATIVES', initiatives);
    const message = generateInitiativeMessage(initiatives);
    console.log('Message is ', JSON.stringify(message));
    success(message);
  } catch (err) {
    error(err);
  }
});

async function getInitiatives(): Promise<InitiativeResponse[]> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: 'begins_with(#type, :type)',
    ExpressionAttributeNames: { '#type': 'type' },
    ExpressionAttributeValues: { ':type': INITIATIVE_TYPE }
  };
  console.log('Getting all initiatives with params', params);
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  return records.map(initiative => new InitiativeResponse(initiative));
}
