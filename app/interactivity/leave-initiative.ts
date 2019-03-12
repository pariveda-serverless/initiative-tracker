import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { DetailResponse } from '../slack-messages';
import { getInitiativeDetails } from './get-initiative-details';
import { DeleteMemberRequest } from '../members';
import { initiativesTable } from '../shared';

export async function leaveInitiativeAction(teamId: string, channel: string, payload: ActionPayload): Promise<Message> {
  const action = payload.actions[0];
  const { initiativeId, slackUserId } = parseValue(
    action.selected_option ? action.selected_option.value : action.value
  );
  await leaveInitiative(initiativeId, teamId, slackUserId);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  return new DetailResponse(initiative, slackUserId, channel);
}

async function leaveInitiative(initiativeId: string, teamId: string, slackUserId: string): Promise<any> {
  const Key = new DeleteMemberRequest({ initiativeId, teamId, slackUserId });
  const params = { TableName: process.env.INITIATIVES_TABLE, Key };
  console.log('Removing member from initiative with params', params);
  return initiativesTable.delete(params).promise();
}
