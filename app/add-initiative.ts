import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateInitiativeRequest, InitiativeResponse, InitiativeRecord, INITIATIVE_TYPE } from './initiative';
import { getUserProfile } from './slack/profile';
import { DetailResponse } from './slack-responses/initiative-details';
import { MemberResponse, MEMBER_TYPE, TEAM, getTeamIdentifier } from './member';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const slackUserId = body.user_id;
    const team = { id: body.team_id, domain: body.team_domain };
    const createdBy = await getUserProfile(slackUserId, team.id);
    const [name, ...remaining] = body.text.split(',');
    const { channel, description } = getChannelAndDescription(remaining);
    const initiativeRequest = new CreateInitiativeRequest({ name, team, description, channel, createdBy });
    await saveInitiative(initiativeRequest);
    const initiativeDetails = await getInitiativeDetails(team.id, initiativeRequest.initiativeId);
    const message = new DetailResponse(initiativeDetails, createdBy.slackUserId);
    console.log(message);
    console.log(JSON.stringify(message));
    success(message);
  } catch (err) {
    error(err);
  }
});

function getChannelAndDescription(remaining: string[]): { channel: string; description: string } {
  console.log('Getting channel from remaining', remaining);
  let channel, description;
  const first = remaining.length ? remaining[0].trim() : null;
  const second = remaining.length && remaining.length > 1 ? remaining[1].trim() : null;
  if (isChannel(second)) {
    channel = second;
    description = first;
  } else if (isChannel(first)) {
    channel = first;
    description = second;
  } else {
    description = remaining.join(' ');
  }
  return { channel, description };
}

function isChannel(text: string): boolean {
  return text && /<.*?>/.test(text);
}

function saveInitiative(Item: CreateInitiativeRequest): Promise<any> {
  const params = { TableName: process.env.INITIATIVES_TABLE, Item };
  console.log('Creating new initiative with params', params);
  return initiatives.put(params).promise();
}

async function getInitiativeDetails(teamId: string, initiativeId: string): Promise<InitiativeResponse> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId and begins_with(#identifiers, :identifiers)',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId', '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId, ':identifiers': getTeamIdentifier(teamId) }
  };
  console.log('Getting initiative details with params', params);
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiative records', records);
  let initiative: InitiativeResponse = new InitiativeResponse(
    records.find(record => record.type.indexOf(INITIATIVE_TYPE) > -1)
  );
  initiative.members = records
    .filter(record => record.type.indexOf(MEMBER_TYPE) > -1)
    .map(record => new MemberResponse(record));
  return initiative;
}
