import { SNS } from 'aws-sdk';
import { wrapper, WrapperSignature } from '@manwaring/lambda-wrapper';
import { InitiativeResponse, Status, InitiativeRecord, INITIATIVE_TYPE } from '../initiatives';
import { initiativesTable } from '../shared';

const sns = new SNS({ apiVersion: '2010-03-31' });

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
  const initiatives = await initiativesTable
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiatives', initiatives);
  return initiatives.map(initiative => new InitiativeResponse(initiative));
}

async function publishInitiativeForStatusUpdateRequest(initiative: InitiativeResponse): Promise<any> {
  const params = {
    Message: JSON.stringify(initiative),
    TopicArn: process.env.REQUEST_UPDATE_SNS
  };
  return sns.publish(params).promise();
}
