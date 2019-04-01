import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { DetailResponse } from '../slack-messages';
import { getChannelInfo } from '../slack-api';
import { getInitiativeIdentifiers } from '../initiatives';
import { table } from '../shared';
import { getQuery } from '../slash-commands/list-initiatives';

export async function editInitiativeAction(teamId: string, channel: string, payload: ActionPayload): Promise<Message> {
  const slackUserId = payload.user.id;
  const { name, description, status, channelId } = payload.submission;
  const { initiativeId, queryId } = parseValue(payload.state);
  await updateInitiative(teamId, initiativeId, name, description, status, channelId);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  const query = await getQuery(queryId);
  return new DetailResponse({ initiative, slackUserId, query, channel });
}

async function updateInitiative(
  teamId: string,
  initiativeId: string,
  name: string,
  description: string,
  status: string,
  channelId: string
): Promise<any> {
  const channel = channelId ? await getChannelInfo(channelId, teamId) : null;
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getInitiativeIdentifiers(teamId) },
    UpdateExpression: 'set #name = :name, #description = :description, #status = :status, #channel = :channel',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#description': 'description',
      '#status': 'status',
      '#channel': 'channel'
    },
    ExpressionAttributeValues: { ':name': name, ':description': description, ':status': status, ':channel': channel }
  };
  console.log('Updating initiative with params', params);
  return table.update(params).promise();
}
