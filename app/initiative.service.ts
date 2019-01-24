import { DynamoDB } from 'aws-sdk';
import { Initiative } from './initiative';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export function getInitiativeById(initiativeId: string): Promise<any> {
    const params = {
      TableName: process.env.INITIATIVES_TABLE,
      Key: { initiativeId }
    };
    return initiatives
      .get(params)
      .promise()
      .then(res => res.Item);
  }

  export function saveInitiative(Item: Initiative): Promise<Initiative> {
    console.log('env = ', process.env)
    console.log('TABLE NAME = ', process.env.INITIATIVES_TABLE)
    const params = { 
        TableName: process.env.INITIATIVES_TABLE, 
        Item 
    };
    return initiatives
      .put(params)
      .promise()
      .then(() => Item);
  }