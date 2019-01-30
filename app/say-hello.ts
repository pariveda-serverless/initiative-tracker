import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';

export const foo = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const message = {
      'text': `Hello ${body.user_id}!`
    }
    success(message);
  } catch (err) {
    error(err);
  }
});