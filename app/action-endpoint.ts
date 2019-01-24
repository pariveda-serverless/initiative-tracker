import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { post } from 'request-promise';

export const handler = apiWrapper(async ({body, success, error} : ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload)
    console.log('Body', body);
    console.log('Payload', payload);
    console.log('Response url', payload.response_url);
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
    console.log('Stringified message is', JSON.stringify(message));
    const params = {
      url: payload.response_url,
      body: JSON.stringify(message),
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      simple: false
    };
    console.log('Responding with params', params);
    const response = await post(params);
    console.log('response', response);
    success(response);
  } catch (err) {
    console.log('Error')
    error(err);
  }
});
