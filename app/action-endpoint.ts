import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';

export const handler = apiWrapper(async ({body, success, error} : ApiSignature) => {
  try {
    console.log('Body', body);
    console.log('Response url', body.response_url);
    const message = {
      text: 'Selection was received by slack!',
      attachments: [
        {
          text: 'This message is ephemeral and is only visible to you.',
          color: '#3AA3E3'
        }
      ],
      response_type: 'ephemeral'
    };
    console.log('Message is: ', message);
    console.log('Stringified message is', JSON.stringify(message));
    console.log('body.response_url = ', body.response_url);
    const params = {
      url: body.response_url,
      body: JSON.stringify(message),
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      simple: false
    };
    console.log('Responding with params', params);
    success(body);
  } catch (err) {
    console.log('Error')
    error(err);
  }
});
