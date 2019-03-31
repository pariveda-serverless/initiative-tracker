import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { InitiativeRecord, InitiativeResponse, Status, getInitiativeIdentifiers } from '../initiatives';
import { ListResponse } from '../slack-messages/';
import { getUserProfile, sendMessage } from '../slack-api';
import { SlashCommandBody } from 'slack';
import { table } from '../shared';
import { CreateQueryRequest, Query } from '../queries';
import { stringifyValue } from '../interactivity';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { teamId, status, office, isPublic, channelId, slackUserId, queryId } = await getFieldsFromBody(body);
    const initiatives = await getInitiatives(teamId, status);
    const message = new ListResponse({ initiatives, channelId, slackUserId, isPublic, status });

    if (queryId && message.blocks && message.blocks.length > 0) {
      message.blocks[0].block_id = stringifyValue({ queryId });
    }
    console.log(message);
    console.log(JSON.stringify(message));
    if (isPublic) {
      await sendMessage(message, teamId);
      success();
    } else {
      success(message);
    }
  } catch (err) {
    error(err);
  }
});

async function getFieldsFromBody(body: SlashCommandBody) {
  const { office } = await getUserProfile(body.user_id, body.team_id);
  const { status, isPublic, queryId } = await parseAndSaveQuery(body.text);
  return {
    teamId: body.team_id,
    status,
    office,
    isPublic,
    channelId: body.channel_id,
    slackUserId: body.user_id,
    queryId
  };
}

async function parseAndSaveQuery(text: string) {
  const queryId = await saveQuery(text);
  return { queryId, ...parseQuery(text) };
}

export async function getQuery(queryId: string): Promise<any> {
  if (!queryId) {
    return;
  } else {
    const params = { TableName: process.env.QUERIES_TABLE, Key: { queryId } };
    console.log('Getting query with params', params);
    const query = await table
      .get(params)
      .promise()
      .then(res => new Query(res.Item));
    return parseQuery(query.parameters);
  }
}

export function parseQuery(text: string): { status: Status; isPublic: boolean } {
  const statuses = text
    .split(',')
    .map(arg => getStatus(arg))
    .filter(status => status !== undefined);
  const isPublics = text
    .split(',')
    .map(arg => getIsPublic(arg))
    .filter(isPublic => isPublic !== undefined);
  const status = statuses && statuses.length > 0 && statuses[0];
  const isPublic = isPublics && isPublics.length > 0 && isPublics[0];
  return { status, isPublic };
}

function getStatus(arg: string): Status {
  const text = arg
    .toUpperCase()
    .trim()
    .replace(' ', '');
  const isStatus = Object.values(Status).includes(text);
  return isStatus ? Status[text] : undefined;
}

function getIsPublic(arg: string): boolean {
  const isPublic = arg.toUpperCase().trim() === 'PUBLIC';
  return isPublic || undefined;
}

async function saveQuery(text: string): Promise<string> {
  const query = new CreateQueryRequest(text);
  const params = { TableName: process.env.QUERIES_TABLE, Item: query };
  console.log('Saving list query with params', params);
  return table
    .put(params)
    .promise()
    .then(() => query.queryId);
}

export async function getInitiatives(teamId: string, status?: Status): Promise<InitiativeResponse[]> {
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
