import { DynamoDB } from 'aws-sdk';
import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';
import { InitiativeRecord, InitiativeResponse, INITIATIVE_TYPE } from './initiative';
import { MemberResponse, MEMBER_TYPE } from './member';
import { requestStatusUpdate } from './slack-calls/status-update';
import { StatusUpdateRequest } from './slack-responses/status-update-request';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
    const initiative = await getInitiativeDetails(message.initiativeId);
    const statusUpdateRequest = new StatusUpdateRequest(initiative);
    const champions = initiative.members.filter(member => member.champion);
    await Promise.all(champions.map(champion => requestStatusUpdate(statusUpdateRequest, champion)));
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
