import { SNS } from 'aws-sdk';
import { wrapper, WrapperSignature } from '@manwaring/lambda-wrapper';
import { InitiativeResponse } from './initiative';
import { getInitiatives } from './list-initiatives';
import { Status } from './status';

const sns = new SNS({ apiVersion: '2010-03-31' });

export const handler = wrapper(async ({ event, success, error }: WrapperSignature) => {
  try {
    const initiatives = await getInitiatives();
    await Promise.all(
      initiatives
        .filter(initiative => initiative.status !== Status.COMPLETE)
        .map(initiative => publishInitiativeForStatusUpdateRequest(initiative))
    );
    success(event);
  } catch (err) {
    error(err);
  }
});

async function publishInitiativeForStatusUpdateRequest(initiative: InitiativeResponse): Promise<any> {
  const params = {
    Message: JSON.stringify(initiative),
    TopicArn: process.env.REQUEST_UPDATE_SNS
  };
  return sns.publish(params).promise();
}
