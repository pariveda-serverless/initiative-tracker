import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const message = { text: `Hello ${body.user_name}!` };
    success(message);
  } catch (err) {
    error(err);
  }
});
