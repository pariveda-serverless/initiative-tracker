import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { InitiativeRecord, InitiativeResponse, getInitiativeIdentifiers, Status } from '../initiatives';
import { ListResponse } from '../slack-messages/';
import { getUserProfile, sendMessage, sendEphemeralMessage } from '../slack-api';
import { SlashCommandBody } from 'slack';
import { table } from '../shared';
import { CreateQueryRequest, Query } from '../queries';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { teamId, office, channelId, slackUserId, query } = await getFieldsFromBody(body);
    const initiatives = await getInitiatives(teamId, query);
    const message = new ListResponse({ initiatives, channelId, slackUserId, query });
    console.log(message);
    console.log(JSON.stringify(message));
    if (query && query.isPublic) {
      await sendMessage(message, teamId);
    } else {
      await sendEphemeralMessage(message, teamId, slackUserId);
    }
    success();
  } catch (err) {
    error(err);
  }
});

async function getFieldsFromBody(body: SlashCommandBody): Promise<Fields> {
  const { office } = await getUserProfile(body.user_id, body.team_id);
  let fields: Fields = {
    teamId: body.team_id,
    office,
    channelId: body.channel_id,
    slackUserId: body.user_id
  };
  if (body.text) {
    const query = await saveQuery(body.text);
    fields = { ...fields, query };
  }
  return fields;
}

interface Fields {
  teamId: string;
  office: string;
  channelId: string;
  slackUserId: string;
  query?: Query;
}

export async function getQuery(queryId: string): Promise<Query> {
  if (!queryId) {
    console.log('No query id to retreive');
    return undefined;
  } else {
    const params = { TableName: process.env.QUERIES_TABLE, Key: { queryId } };
    console.log('Getting query with params', params);
    return await table
      .get(params)
      .promise()
      .then(res => new Query(res.Item));
  }
}

async function saveQuery(text: string): Promise<Query> {
  const query = new CreateQueryRequest(text);
  const params = { TableName: process.env.QUERIES_TABLE, Item: query };
  console.log('Saving list query with params', params);
  return table
    .put(params)
    .promise()
    .then(() => query);
}

export async function getInitiatives(
  teamId: string,
  query: Query,
  statuss?: Status,
  office?: string
): Promise<InitiativeResponse[]> {
  const status = query && query.status ? query.status : undefined;
  const KeyConditionExpression = status
    ? '#identifiers = :identifiers and #status = :status'
    : '#identifiers = :identifiers';
  const ExpressionAttributeNames = status
    ? { '#identifiers': 'identifiers', '#status': 'status' }
    : { '#identifiers': 'identifiers' };
  const ExpressionAttributeValues = status
    ? { ':identifiers': getInitiativeIdentifiers(teamId), ':status': status }
    : { ':identifiers': getInitiativeIdentifiers(teamId) };
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    IndexName: process.env.INITIATIVES_TABLE_STATUS_INDEX,
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
