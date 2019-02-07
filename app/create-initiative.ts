import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateInitiativeRequest } from './initiative';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    console.log(typeof body.text);
    const [name, description] = body.text.split[','];
    const initiative = new CreateInitiativeRequest({ name, description });
    await saveInitiative(initiative);
    const message = {
      text: `${body.user_name} has successfully created initiative:`,
      attachments: [{ text: `${body.text}` }],
      response_type: 'in_channel'
    };
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
