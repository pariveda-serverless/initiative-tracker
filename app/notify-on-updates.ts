import { StreamSignature, streamWrapper } from '@manwaring/lambda-wrapper';

export const handler = streamWrapper(async ({ versions, success, error }: StreamSignature) => {
  try {
    console.log(JSON.stringify(versions));
    success();
  } catch (err) {
    error(err);
  }
});
