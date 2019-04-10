import { ActionPayload, Message } from 'slack';
import { ListResponse } from '../slack-messages';
import { getInitiatives, saveQuery } from '../slash-commands/list-initiatives';
import { Query, CreateQueryRequest } from '../queries';
import { parseValue } from './id-helper';
import { table } from '../shared';

export async function getInitiativeListAction(
  teamId: string,
  channelId: string,
  payload: ActionPayload
): Promise<Message> {
  const slackUserId = payload.user.id;
  const query = await getOrCreateQuery(payload);
  const initiatives = await getInitiatives(teamId);
  return new ListResponse({ initiatives, channelId, slackUserId, query });
}

async function getOrCreateQuery(payload: ActionPayload): Promise<Query> {
  let status, office, queryId;
  if (payload.actions && payload.actions.length > 0 && payload.actions[0].selected_option) {
    ({ status, office, queryId } = parseValue(payload.actions[0].selected_option.value));
  }
  let query;
  console.log('QueryId', queryId);
  if (queryId) {
    const existing = await getQuery(queryId);
    console.log('Existing', existing);
    const updated = existing.getUpdateRequest({ status, office });
    console.log('Updating', updated);
    query = await saveQuery(updated);
    console.log('Updated', query);
  } else {
    const queryRequest = new CreateQueryRequest({ status, office });
    query = await saveQuery(queryRequest);
  }
  return query;
}

async function getQuery(queryId: string): Promise<Query> {
  const params = { TableName: process.env.QUERIES_TABLE, Key: { queryId } };
  console.log('Getting query with params', params);
  return await table
    .get(params)
    .promise()
    .then(res => new Query(res.Item));
}
