import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { InitiativeRecord, InitiativeResponse, Status, getInitiativeIdentifiers } from '../initiatives';
import { ListResponse } from '../slack-messages/';
import { getUserProfile } from '../slack-api';
import { SlashCommandBody } from 'slack';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { teamId, status, office } = await getFieldsFromBody(body);
    const initiatives = await getInitiatives(teamId, status);
    const message = new ListResponse(initiatives, status);
    console.log(message);
    console.log(JSON.stringify(message));
    success(message);
  } catch (err) {
    error(err);
  }
});

async function getFieldsFromBody(body: SlashCommandBody) {
  const { office } = await getUserProfile(body.user_id, body.team_id);
  const teamId = body.team_id;
  const text = body.text
    ? body.text
        .toUpperCase()
        .trim()
        .replace(' ', '_')
    : '';
  const status: Status | undefined = <any>Status[text];
  return { teamId, status, office };
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
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiatives', records);
  return records.map(initiative => new InitiativeResponse(initiative));
}
