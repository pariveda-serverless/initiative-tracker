import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { InitiativeRecord, Initiative, getInitiativeIdentifiers } from '../initiatives';
import { ListResponse } from '../slack-messages/';
import { getUserProfile, sendMessage, sendEphemeralMessage } from '../slack-api';
import { SlashCommandBody } from 'slack';
import { table } from '../shared';
import { Query, CreateQueryRequest } from '../queries';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { teamId, channelId, slackUserId, query } = await getFieldsFromBody(body);
    const initiatives = await getInitiatives(teamId);
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
  const queryRequest = new CreateQueryRequest({ text: body.text, office });
  const query = await saveQuery(queryRequest);
  return {
    teamId: body.team_id,
    channelId: body.channel_id,
    slackUserId: body.user_id,
    query
  };
}

interface Fields {
  teamId: string;
  channelId: string;
  slackUserId: string;
  query?: Query;
}

export async function saveQuery(query: CreateQueryRequest): Promise<Query> {
  const params = { TableName: process.env.QUERIES_TABLE, Item: query };
  console.log('Saving query with params', params);
  await table.put(params).promise();
  return query.getQuery();
}

export async function getInitiatives(teamId: string): Promise<Initiative[]> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    IndexName: process.env.INITIATIVES_TABLE_IDENTIFIERS_INDEX,
    KeyConditionExpression: '#identifiers = :identifiers',
    ExpressionAttributeNames: { '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':identifiers': getInitiativeIdentifiers(teamId) }
  };
  console.log('Getting all initiatives with params', params);
  const records = await table
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiatives', records);
  return records.map(initiative => new Initiative(initiative));
}
