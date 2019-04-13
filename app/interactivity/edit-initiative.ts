import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { DetailResponse } from '../slack-messages';
import { getChannelInfo } from '../slack-api';
import { getInitiativeIdentifiers } from '../initiatives';
import { table } from '../shared';

export async function editInitiativeAction(
  teamId: string,
  channel: string,
  payload: ActionPayload
): Promise<{ response: Message; responseUrl: string }> {
  const slackUserId = payload.user.id;
  const { name, description, status, office, channelId } = payload.submission;
  const { initiativeId, responseUrl } = parseValue(payload.state);
  await updateInitiative(teamId, initiativeId, name, description, status, office, channelId);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return { response: new DetailResponse({ initiative, slackUserId, channel }), responseUrl };
}

async function updateInitiative(
  teamId: string,
  initiativeId: string,
  name: string,
  description: string,
  status: string,
  office: string,
  channelId: string
): Promise<any> {
  const channel = channelId ? await getChannelInfo(channelId, teamId) : null;
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getInitiativeIdentifiers(teamId) },
    UpdateExpression:
      'set #name = :name, #description = :description, #status = :status, #channel = :channel, #office = :office',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#description': 'description',
      '#status': 'status',
      '#channel': 'channel',
      '#office': 'office'
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':description': description,
      ':status': status,
      ':channel': channel,
      ':office': office
    }
  };
  console.log('Updating initiative with params', params);
  return table.update(params).promise();
}
