import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse } from './initiative';
import { ListResponse } from './slack-components/list-response';
import { Status } from './status';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ success, error }: ApiSignature) => {
  try {
    const initiatives = await getInitiatives();
    const message = new ListResponse(initiatives);
    success(message);
  } catch (err) {
    error(err);
  }
});

async function getInitiatives(status?: Status): Promise<InitiativeResponse[]> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    IndexName: process.env.INITIATIVES_TABLE_STATUS_INDEX,
    KeyConditionExpression: `#type = :type${status ? ' and #status = :status' : ''}`,
    ExpressionAttributeNames: { '#type': 'type', '#status': 'status' },
    ExpressionAttributeValues: { ':type': INITIATIVE_TYPE, ':status': status }
  };
  console.log('Getting all initiatives with params', params);
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiatives', records);
  return records.map(initiative => new InitiativeResponse(initiative));
}
