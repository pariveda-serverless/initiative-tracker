import { DynamoDB } from 'aws-sdk';
import { Initiative } from './initiative';
import { TableItem } from '../shared/table-item'

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

  export function saveInitiative(initiative: Initiative): Promise<Initiative> {
    // This can be done better, but not sure what is the right mix of business logic and abstraction in this case
    const initiativeItem = new TableItem({
      'body': initiative,
      'partitionKey': `${initiative.constructor.name}:${initiative.id}`,
      'sortKey': `USER:${initiative.creator}`
    })

    const params = { 
        TableName: process.env.INITIATIVES_TABLE, 
        Item: initiativeItem
    };
    return initiatives
      .put(params)
      .promise()
      .then(() => initiative);
  }