import { apiWrapper } from '@manwaring/lambda-wrapper';

export const handler = apiWrapper(async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event
    })
  };
});
