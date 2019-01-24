import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { post } from 'request-promise';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    console.log('Body', body);
    console.log('Response url', body.response_url);
    const message = {
      text: 'Initiative registration',
      attachments: [
        {
          title: 'Confirmation', 
          text: `${body.user_name} Are you sure you want to create the initiative "${body.text}"?`,
          fallback: 'This is a fallback message, something must have gone wrong...',
          callback_id: 'INITIATIVE_REGISTRATION',
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'yes',
              text: 'yes',
              type: 'button',
              value: body.text
            },
            {
              name: 'complete',
              text: 'no',
              type: 'button',
              value: ''
            }
          ]
        }
      ]
    };
    console.log('Message is ', message);
    success(message);
  } catch (err) {
    error(err);
  }
});
