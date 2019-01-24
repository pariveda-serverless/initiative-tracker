import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { post } from 'request-promise';
import { Initiative } from './initiative'
import { saveInitiative } from './initiative.service'

export const handler = apiWrapper(async ({body, success, error} : ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload)
    console.log('Body', body);
    console.log('Payload', payload);
    console.log('Response url', payload.response_url);

    const initiative = new Initiative({
      'creator': 'Jorge',
      'name': 'Test',
      'description': 'This is only a test.',
    });

    await saveInitiative(initiative);

    const message = {
      text: 'Selection was received by slack!',
      attachments: [
        {
          text: 'This message is ephemeral and is only visible to you.',
        }
      ],
      response_type: 'in_channel'
    };

    console.log('Message is: ', message);
    success(message);
  } catch (err) {
    console.log('Error')
    error(err);
  }
});
