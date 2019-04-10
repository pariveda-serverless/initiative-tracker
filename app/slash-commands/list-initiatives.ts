import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { InitiativeRecord, Initiative, getInitiativeIdentifiers, Status } from '../initiatives';
import { ListResponse } from '../slack-messages/';
import { getUserProfile, sendMessage, sendEphemeralMessage } from '../slack-api';
import { SlashCommandBody } from 'slack';
import { table } from '../shared';
import { Query } from '../queries';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { teamId, office, channelId, slackUserId, query } = await getFieldsFromBody(body);
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
  let fields: Fields = {
    teamId: body.team_id,
    office,
    channelId: body.channel_id,
    slackUserId: body.user_id
  };
  if (body.text) {
    const query = new Query({ text: body.text, office });
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
