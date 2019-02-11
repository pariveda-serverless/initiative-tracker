import { SNS } from 'aws-sdk';
import { wrapper, WrapperSignature, snsWrapper } from '@manwaring/lambda-wrapper';

const sns = new SNS({ apiVersion: '2010-03-31' });

export const handler = wrapper(async ({ event, success, error }: WrapperSignature) => {
  try {
    // TODO get all initiatives
    // TODO see when last status update was requested and if should make a new request
    // TODO if should request update send sns message for lambda to make request
    await publishInitiativesForFeedbackRequests(event);
    success(event);
  } catch (err) {
    error(err);
  }
});

async function publishInitiativesForFeedbackRequests(message: any): Promise<any> {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: process.env.REQUEST_FEEDBACK_SNS
  };
  return sns.publish(params).promise();
}
