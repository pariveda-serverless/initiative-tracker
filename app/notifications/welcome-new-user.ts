import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
    success();
  } catch (err) {
    error(err);
  }
});
