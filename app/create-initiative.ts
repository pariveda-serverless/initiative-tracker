import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateInitiativeRequest } from './initiative';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    console.log('Body', body);
    console.log('Response url', body.response_url);

    const initiative = new CreateInitiativeRequest({ name: body.text });

    await saveInitiative(initiative);

    // TODO: Use slack component templates, separate the UI from the backend
    const message = {
      text: `${body.user_name} has created initiative:`,
      attachments: [
        // TODO: PUT INITIATIVE SLACK ATTACHMENTS
        {
          text: `${body.text}`
        }
      ],
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
