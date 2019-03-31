import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';
import { InitiativeRecord, InitiativeResponse, INITIATIVE_TYPE } from '../initiatives';
import { MemberResponse, MEMBER_TYPE } from '../members';
import { sendMessage } from '../slack-api';
import { NewMemberNotification } from '../slack-messages';
import { table } from '../shared';

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
    const initiative = await getInitiativeDetails(message.initiativeId);
    if (initiative.channel) {
      const notification = new NewMemberNotification(initiative, <MemberResponse>message);
      await sendMessage(notification, initiative.team.id);
    }
    success();
  } catch (err) {
    error(err);
  }
});

async function getInitiativeDetails(initiativeId: string): Promise<InitiativeResponse> {
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
  let initiative: InitiativeResponse = new InitiativeResponse(
    records.find(record => record.type.indexOf(INITIATIVE_TYPE) > -1)
  );
  initiative.members = records
    .filter(record => record.type.indexOf(MEMBER_TYPE) > -1)
    .map(record => new MemberResponse(record));
  return initiative;
}
