import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { DetailResponse } from '../slack-messages';
import { getInitiativeDetails } from './get-initiative-details';
import { getMemberIdentifiers } from '../members';
import { initiativesTable } from '../shared';
import { MemberAction } from './interactions';

export async function changeMembershipAction(
  teamId: string,
  channel: string,
  payload: ActionPayload
): Promise<Message> {
  const { initiativeId, slackUserId, action } = parseValue(payload.actions[0].selected_option.value);
  await changeMembership(initiativeId, teamId, slackUserId, action === MemberAction.MAKE_CHAMPION);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return new DetailResponse({ initiative, slackUserId, channel });
}

async function changeMembership(
  initiativeId: string,
  teamId: string,
  slackUserId: string,
  champion: boolean
): Promise<any> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getMemberIdentifiers(teamId, slackUserId) },
    UpdateExpression: 'set #champion = :champion',
    ExpressionAttributeNames: { '#champion': 'champion' },
    ExpressionAttributeValues: { ':champion': champion }
  };
  console.log('Updating membership type with params', params);
  await initiativesTable.update(params).promise();
}
