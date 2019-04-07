import { ActionPayload } from 'slack';
import { table } from '../shared';
import { Status } from '../initiatives';
import { parseValue } from './id-helper';
import { getQuery, saveQuery } from '../slash-commands/list-initiatives';
import { Query } from '../queries';

export async function updateQueryWithOfficeFilterAction(queryId: string, payload: ActionPayload): Promise<any> {
  const query = await getQuery(queryId);
  const { office } = parseValue(payload.actions[0].selected_option.value);
  await updateQueryWithOfficeFilter(query, office);
}

export async function updateQueryWithStatusFilterAction(queryId: string, payload: ActionPayload): Promise<any> {
  const query = await getQuery(queryId);
  const { status } = parseValue(payload.actions[0].selected_option.value);
  await updateQueryWithStatusFilter(query, status);
}

async function updateQueryWithOfficeFilter(query: Query, office: string): Promise<any> {
  if (query) {
    const params = {
      TableName: process.env.QUERIES_TABLE,
      Key: { queryId: query.queryId },
      UpdateExpression: 'set #office = :office',
      ExpressionAttributeNames: { '#office': 'office' },
      ExpressionAttributeValues: { ':office': office }
    };
    console.log('Updating query with params', params);
    return table.update(params).promise();
  } else {
    await saveQuery(null, office);
  }
}

async function updateQueryWithStatusFilter(query: Query, status: Status): Promise<any> {
  if (query) {
    const params = {
      TableName: process.env.QUERIES_TABLE,
      Key: { queryId: query.queryId },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': status }
    };
    console.log('Updating query with params', params);
    return table.update(params).promise();
  } else {
    await saveQuery(status.toString());
  }
}
