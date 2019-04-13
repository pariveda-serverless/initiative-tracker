import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateInitiativeRequest, Initiative, InitiativeRecord, INITIATIVE_TYPE } from '../initiatives';
import { getAndSaveUserProfile } from '../slack-api';
import { DetailResponse } from '../slack-messages';
import { Member, MEMBER_TYPE, getTeamIdentifier } from '../members';
import { SlashCommandBody, Message } from 'slack';
import { table } from '../shared';
import { InvalidAddResponse } from '../slack-messages/validation';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    let message: Message;
    const { team, createdBy, text, name, channel, description } = await getFieldsFromBody(body);
    if (name) {
      const initiativeRequest = new CreateInitiativeRequest({ name, team, description, channel, createdBy });
      await saveInitiative(initiativeRequest);
      const initiative = await getInitiativeDetails(team.id, initiativeRequest.initiativeId);
      message = new DetailResponse({ initiative, slackUserId: createdBy.slackUserId });
    } else {
      message = new InvalidAddResponse(text, createdBy);
    }

    console.log(JSON.stringify(message));
    success(message);
  } catch (err) {
    error(err);
  }
});

async function getFieldsFromBody(body: SlashCommandBody) {
  const slackUserId = body.user_id;
  const team = { id: body.team_id, domain: body.team_domain };
  const createdBy = await getAndSaveUserProfile(slackUserId, team.id);
  const [name, ...remaining] = body.text.split(',');
  const { channel, description } = getChannelAndDescription(remaining);
  return { team, createdBy, name, text: body.text, channel, description };
}

function getChannelAndDescription(
  remaining: string[]
): { channel: { id: string; name: string; parsed: string }; description: string } {
  console.log('Getting channel from remaining', remaining);
  let channel, description;
  const first = remaining.length ? remaining[0].trim() : null;
  const second = remaining.length && remaining.length > 1 ? remaining[1].trim() : null;
  if (isChannel(second)) {
    channel = getChannel(second);
    description = first;
  } else if (isChannel(first)) {
    channel = getChannel(first);
    description = second;
  } else {
    description = remaining.join(',');
  }
  return { channel, description };
}

function isChannel(text: string): boolean {
  return text && /<.*?>/.test(text);
}

function getChannel(channel: string): { id: string; name: string; parsed: string } {
  const parsed = channel;
  const id = channel
    .match(/#.*?\|/)[0]
    .replace('#', '')
    .replace('|', '');
  const name = channel
    .match(/\|.*?\>/)[0]
    .replace('|', '')
    .replace('>', '');
  return { id, name, parsed };
}

export function getParsedChannel(id: string, name: string): string {
  return `<#${id}|${name}>`;
}

function saveInitiative(Item: CreateInitiativeRequest): Promise<any> {
  const params = { TableName: process.env.INITIATIVES_TABLE, Item };
  console.log('Creating new initiative with params', params);
  return table.put(params).promise();
}

async function getInitiativeDetails(teamId: string, initiativeId: string): Promise<Initiative> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId and begins_with(#identifiers, :identifiers)',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId', '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId, ':identifiers': getTeamIdentifier(teamId) }
  };
  console.log('Getting initiative details with params', params);
  const records = await table
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiative records', records);
  let initiative: Initiative = new Initiative(records.find(record => record.type.indexOf(INITIATIVE_TYPE) > -1));
  initiative.members = records
    .filter(record => record.type.indexOf(MEMBER_TYPE) > -1)
    .map(record => new Member(record));
  return initiative;
}
