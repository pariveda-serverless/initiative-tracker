import { DynamoDB } from 'aws-sdk';
import { CreateInitiativeRequest, CreateMemberRequest } from '../initiative';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export function getInitiativeByName(initiativeName: string): Promise<any> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: 'partitionKey = :pkey',
    ExpressionAttributeValues: {
      ':pkey': `INITIATIVE:${initiativeName}`
    }
  };
  console.log('PARAMS ', params);
  return initiatives
    .query(params)
    .promise()
    .then(res => res.Items);
}
