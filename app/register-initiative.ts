import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { post } from 'request-promise';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    console.log('Body', body);
    console.log('Response url', body.response_url);
    const message = {
      text: 'This is a test message',
      attachments: [
        {
          text: 'Are you still working on your initiative?',
          fallback: 'This is a fallback message, something must have gone wrong...',
          callback_id: 'INITIATIVE_STATUS',
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'yes',
              text: 'yes',
              type: 'button',
              value: 'yes'
            },
            {
              name: 'complete',
              text: 'no',
              type: 'button',
              value: 'no'
            }
          ]
        }
      ]
    };
    console.log('Message is ', message);
    console.log('Stringified message is ', JSON.stringify(message));
    const params = {
      url: body.response_url,
      body: JSON.stringify(message),
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      simple: false
    };
    console.log('Responding with params', params);
    const response = await post(params);
    success(response);
  } catch (err) {
    error(err);
  }
});
