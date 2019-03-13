import { Message, ActionPayload } from 'slack';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { getInitiativeIdentifiers, Status } from '../initiatives';
import { initiativesTable } from '../shared';
import { DetailResponse } from '../slack-messages';

export async function updateStatusAction(teamId: string, channel: string, payload: ActionPayload): Promise<Message> {
  const value = payload.actions[0].value ? payload.actions[0].value : payload.actions[0].selected_option.value;
  const { initiativeId, status } = parseValue(value);
  const slackUserId = payload.user.id;
  await updateInitiativeStatus(initiativeId, teamId, status);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return new DetailResponse(initiative, slackUserId, channel);
}

async function updateInitiativeStatus(initiativeId: string, teamId: string, status: Status): Promise<any> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getInitiativeIdentifiers(teamId) },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status }
  };
  console.log('Updating initiative status with params', params);
  await initiativesTable.update(params).promise();
}
