import { ActionPayload, Message } from 'slack';
import { parseValue } from './id-helper';
import { DeleteResponse, EditInitiativeDialog } from '../slack-messages';
import { getInitiativeDetails } from './get-initiative-details';
import { sendDialogue } from '../slack-api';
import { getTeamIdentifier } from '../members';
import { initiativesTable } from '../shared';
import { InitiativeRecord, InitiativeResponse, INITIATIVE_TYPE } from '../initiatives';
import { InitiativeAction } from './interactions';

export async function modifyInitiativeAction(
  teamId: string,
  channel: string,
  payload: ActionPayload,
  triggerId: string
): Promise<Message> {
  let response: Message;
  const { initiativeId, action } = parseValue(payload.actions[0].selected_option.value);
  switch (action) {
    case InitiativeAction.DELETE: {
      const name = await deleteInitiative(teamId, initiativeId);
      response = new DeleteResponse(channel, name);
      break;
    }
    case InitiativeAction.OPEN_EDIT_DIALOG: {
      const initiative = await getInitiativeDetails(teamId, initiativeId);
      const dialog = new EditInitiativeDialog(initiative, triggerId);
      await sendDialogue(teamId, dialog);
      break;
    }
  }
  return response;
}

async function deleteInitiative(teamId: string, initiativeId: string): Promise<string> {
  const queryParams = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId and begins_with(#identifiers, :identifiers)',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId', '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId, ':identifiers': getTeamIdentifier(teamId) }
  };
  console.log('Getting initiative details with params', queryParams);
  const records = await initiativesTable
    .query(queryParams)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  const initiative = new InitiativeResponse(records.find(record => record.type === INITIATIVE_TYPE));
  const deleteParams = { RequestItems: {} };
  deleteParams.RequestItems[process.env.INITIATIVES_TABLE] = records.map(record => {
    return {
      DeleteRequest: { Key: { initiativeId: record.initiativeId, identifiers: record.identifiers } }
    };
  });
  console.log('Deleting initiative with params', deleteParams);
  await initiativesTable.batchWrite(deleteParams).promise();
  return initiative ? initiative.name : '';
}
