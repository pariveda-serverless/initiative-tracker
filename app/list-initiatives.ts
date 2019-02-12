import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse } from './initiative';
import { ListResponse } from './slack-responses/list-response';
import { Status } from './status';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const text = body.text
      ? body.text
          .toUpperCase()
          .trim()
          .replace(' ', '_')
      : '';
    console.log('status argument', text);
    const status: Status | undefined = <any>Status[text];
    console.log('status', status);
    const initiatives = await getInitiatives(status);
    const message = new ListResponse(initiatives);
    success(message);
  } catch (err) {
    error(err);
  }
});

export async function getInitiatives(status?: Status): Promise<InitiativeResponse[]> {
  const KeyConditionExpression = status ? '#type = :type and #status = :status' : '#type = :type';
  const ExpressionAttributeNames = status ? { '#type': 'type', '#status': 'status' } : { '#type': 'type' };
  const ExpressionAttributeValues = status
    ? { ':type': INITIATIVE_TYPE, ':status': status }
    : { ':type': INITIATIVE_TYPE };
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    IndexName: process.env.INITIATIVES_TABLE_STATUS_INDEX,
    KeyConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  };
  console.log('Getting all initiatives with params', params);
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiatives', records);
  return records.map(initiative => new InitiativeResponse(initiative));
}
