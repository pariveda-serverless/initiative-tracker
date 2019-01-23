import { apiWrapper } from '@manwaring/lambda-wrapper';

export const handler = apiWrapper(async (body, success, error) => {
  try {
    console.log(body);
    success(body);
  } catch (err) {
    error(err);
  }
});
