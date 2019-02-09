import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { ActionType, InitiativeIntent } from './interactions';
import { CreateMemberRequest, MEMBER_TYPE, MemberResponse } from './member';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse } from './initiative';
import { DetailResponse } from './slack-components/detail-response';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload);
    const { callback_id: action } = payload;
    let response: any;
    switch (action) {
      case ActionType.INITIATIVE_ACTION:
        response = await handleListActions(payload);
        break;
      default:
        break;
    }
    success(response);
  } catch (err) {
    error(err);
  }
});

async function handleListActions(payload: any): Promise<any> {
  const intent: InitiativeIntent = payload.actions[0].name;
  let response: any;
  switch (intent) {
    case InitiativeIntent.JOIN_AS_CHAMPION:
      response = await joinInitiativeHandler(payload, true);
      break;
    case InitiativeIntent.JOIN_AS_MEMBER:
      response = await joinInitiativeHandler(payload, false);
      break;
    case InitiativeIntent.VIEW_DETAILS:
      response = await viewDetailsHandler(payload);
      break;
    default:
      break;
  }
  return response;
}

async function joinInitiativeHandler(payload: any, champion: boolean): Promise<any> {
  const initiativeId: string = payload.actions[0].value;
  const member = new CreateMemberRequest({
    initiativeId,
    slackUserId: payload.user.id,
    name: payload.user.name,
    champion: champion
  });
  await joinInitiative(member);
  const message = {
    text: `User ${member.name}  joined initiative ${initiativeId} as a ${member.champion ? 'champion' : 'member'}!`,
    response_type: 'in_channel'
  };
  return message;
}

function joinInitiative(Item: CreateMemberRequest): Promise<any> {
  const params = { TableName: process.env.INITIATIVES_TABLE, Item };
  console.log('Adding member to initiative with params', params);
  return initiatives.put(params).promise();
}

async function viewDetailsHandler(payload: any) {
  const initiativeId: string = payload.actions[0].value;
  const initiative = await getInitiativeDetails(initiativeId);
  return new DetailResponse(initiative);
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
