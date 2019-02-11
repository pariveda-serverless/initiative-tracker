import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
    success(message);
  } catch (err) {
    error(err);
  }
});
