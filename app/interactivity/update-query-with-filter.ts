import { ActionPayload } from 'slack';
import { table } from '../shared';
import { Status } from '../initiatives';
import { parseValue } from './id-helper';

export async function updateQueryWithOfficeFilterAction(queryId: string, payload: ActionPayload): Promise<any> {
  const { office } = parseValue(payload.actions[0].selected_option.value);
  await updateQueryWithOfficeFilter(queryId, office);
}

export async function updateQueryWithStatusFilterAction(queryId: string, payload: ActionPayload): Promise<any> {
  const { status } = parseValue(payload.actions[0].selected_option.value);
  await updateQueryWithStatusFilter(queryId, status);
}

async function updateQueryWithOfficeFilter(queryId: string, office: string): Promise<any> {
  const params = {
    TableName: process.env.QUERIES_TABLE,
    Key: { queryId },
    UpdateExpression: 'set #office = :office',
    ExpressionAttributeNames: { '#office': 'office' },
    ExpressionAttributeValues: { ':office': office }
  };
  console.log('Updating query with params', params);
  return table.update(params).promise();
}

async function updateQueryWithStatusFilter(queryId: string, status: Status): Promise<any> {
  const params = {
    TableName: process.env.QUERIES_TABLE,
    Key: { queryId },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status }
  };
  console.log('Updating query with params', params);
  return table.update(params).promise();
}
