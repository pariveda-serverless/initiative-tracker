import { ActionPayload, Message } from 'slack';
import { DeleteResponse } from '../slack-messages';
import { parseValue } from './id-helper';
import { getTeamIdentifier } from '../members';
import { table } from '../shared';
import { InitiativeRecord, Initiative, INITIATIVE_TYPE } from '../initiatives';

export async function deleteInitiativeAction(
  teamId: string,
  channel: string,
  payload: ActionPayload
): Promise<Message> {
  const { initiativeId } = parseValue(payload.actions[0].selected_option.value);
  const name = await deleteInitiative(teamId, initiativeId);
  return new DeleteResponse(channel, name);
}

async function deleteInitiative(teamId: string, initiativeId: string): Promise<string> {
  const queryParams = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId and begins_with(#identifiers, :identifiers)',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId', '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId, ':identifiers': getTeamIdentifier(teamId) }
  };
  console.log('Getting initiative details with params', queryParams);
  const records = await table
    .query(queryParams)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  const initiative = new Initiative(records.find(record => record.type === INITIATIVE_TYPE));
  const deleteParams = { RequestItems: {} };
  deleteParams.RequestItems[process.env.INITIATIVES_TABLE] = records.map(record => {
    return {
      DeleteRequest: { Key: { initiativeId: record.initiativeId, identifiers: record.identifiers } }
    };
  });
  console.log('Deleting initiative with params', deleteParams);
  await table.batchWrite(deleteParams).promise();
  return initiative ? initiative.name : '';
}
