import { apiWrapper } from '@manwaring/lambda-wrapper';
import { post } from 'request-promise';

export const handler = apiWrapper(async (body, success, error) => {
  try {
    console.log(body);
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
    const params = {
      url: body.response_url,
      body: JSON.stringify(message),
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      simple: false
    };
    const response = await post(params);
    success(response);
  } catch (err) {
    error(err);
  }
});
