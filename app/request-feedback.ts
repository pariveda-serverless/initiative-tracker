import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
    // TODO get initiative information (including champions and members)
    // Send status update requests (to champions only?)
    success(message);
  } catch (err) {
    error(err);
  }
});
