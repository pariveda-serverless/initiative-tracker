import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateInitiativeRequest, InitiativeResponse, InitiativeRecord, INITIATIVE_TYPE } from './initiative';
import { getUserProfile } from './slack-calls/profile';
import { DetailResponse } from './slack-responses/detail-response';
import { MemberResponse, MEMBER_TYPE } from './member';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { name: createdBy, icon: createdByIcon, slackUserId } = await getUserProfile(body.user_id);
    const [name, ...remaining] = body.text.split(',');
    const description = remaining.join(',').trim();
    const initiativeRequest = new CreateInitiativeRequest({ name, description, createdBy, createdByIcon });
    await saveInitiative(initiativeRequest);
    const initiativeDetails = await getInitiativeDetails(initiativeRequest.initiativeId);
    const message = new DetailResponse(initiativeDetails, slackUserId);
    console.log(message);
    console.log(JSON.stringify(message));
    success(message);
  } catch (err) {
    error(err);
  }
});

function saveInitiative(Item: CreateInitiativeRequest): Promise<any> {
  const params = { TableName: process.env.INITIATIVES_TABLE, Item };
  console.log('Creating new initiative with params', params);
  return initiatives.put(params).promise();
}

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
