import { SNS, DynamoDB } from 'aws-sdk';
import { wrapper, WrapperSignature, snsWrapper } from '@manwaring/lambda-wrapper';
import { InitiativeResponse, INITIATIVE_TYPE, InitiativeRecord } from './initiative';
import { Status } from './status';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });
const sns = new SNS({ apiVersion: '2010-03-31' });

export const handler = wrapper(async ({ event, success, error }: WrapperSignature) => {
  try {
    const initiatives = await getInitiatives();
    await Promise.all(initiatives.map(initiative => publishInitiativeForStatusUpdateRequest(initiative)));
    success(event);
  } catch (err) {
    error(err);
  }
});

async function publishInitiativeForStatusUpdateRequest(initiative: InitiativeResponse): Promise<any> {
  const params = {
    Message: JSON.stringify(initiative),
    TopicArn: process.env.REQUEST_FEEDBACK_SNS
  };
  return sns.publish(params).promise();
}

async function getInitiatives(status?: Status): Promise<InitiativeResponse[]> {
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
