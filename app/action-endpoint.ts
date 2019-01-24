import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    console.log(body);
    success(body);
  } catch (err) {
    error(err);
  }
});
