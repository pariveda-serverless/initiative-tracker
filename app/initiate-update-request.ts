import { SNS, DynamoDB } from 'aws-sdk';
import { wrapper, WrapperSignature } from '@manwaring/lambda-wrapper';
import { InitiativeResponse, Status, InitiativeRecord, INITIATIVE_TYPE } from './initiative';

const sns = new SNS({ apiVersion: '2010-03-31' });
const table = new DynamoDB.DocumentClient({ region: process.env.REGION, apiVersion: '2012-08-10' });

export const handler = wrapper(async ({ event, success, error }: WrapperSignature) => {
  try {
    const initiatives = await getAllInitiatives();
    await Promise.all(
      initiatives
        .filter(initiative => initiative.status !== Status.COMPLETE)
        .map(initiative => publishInitiativeForStatusUpdateRequest(initiative))
    );
    success(event);
  } catch (err) {
    error(err);
  }
});

async function getAllInitiatives(): Promise<InitiativeResponse[]> {
  const KeyConditionExpression = '#type = :type';
  const ExpressionAttributeNames = { '#type': 'type' };
  const ExpressionAttributeValues = { ':type': INITIATIVE_TYPE };
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    IndexName: process.env.INITIATIVES_TABLE_TYPE_INDEX,
    KeyConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  };
  console.log('Getting all initiatives with params', params);
  const records = await table
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiatives', records);
  return records.map(initiative => new InitiativeResponse(initiative));
}

async function publishInitiativeForStatusUpdateRequest(initiative: InitiativeResponse): Promise<any> {
  const params = {
    Message: JSON.stringify(initiative),
    TopicArn: process.env.REQUEST_UPDATE_SNS
  };
  return sns.publish(params).promise();
}
