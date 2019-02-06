import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateMemberRequest } from './initiative';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload);
    const selection = payload.actions[0].value;
    const role = selection.split(':')[0];
    const initiativeId = selection.split(':')[1];
    console.log('Payload', payload);

    const member = new CreateMemberRequest({
      slackUserId: payload.user.id,
      name: payload.user.name,
      initiativeId,
      champion: role && role === 'CHAMPION'
    });

    await joinInitiative(member);

    const message = {
      text: `User ${member.name}  joined initiative ${initiativeId} as a ${member.champion ? 'champion' : 'member'}!`,
      response_type: 'in_channel'
    };
    success(message);
  } catch (err) {
    error(err);
  }
});

export function joinInitiative(Item: CreateMemberRequest): Promise<any> {
  const params = { TableName: process.env.INITIATIVES_TABLE, Item };
  console.log('Adding member to initiative with params', params);
  return initiatives.put(params).promise();
}
