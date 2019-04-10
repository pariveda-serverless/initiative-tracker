import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';
import { InitiativeRecord, Initiative, INITIATIVE_TYPE } from '../initiatives';
import { Member, MEMBER_TYPE } from '../members';
import { sendMessage } from '../slack-api';
import { NewMemberNotification } from '../slack-messages';
import { table } from '../shared';

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
    const initiative = await getInitiativeDetails(message.initiativeId);
    if (initiative.channel) {
      const notification = new NewMemberNotification(initiative, <Member>message);
      await sendMessage(notification, initiative.team.id);
    }
    success();
  } catch (err) {
    error(err);
  }
});

async function getInitiativeDetails(initiativeId: string): Promise<Initiative> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId }
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
