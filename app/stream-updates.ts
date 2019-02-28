import { SNS } from 'aws-sdk';
import { StreamSignature, streamWrapper } from '@manwaring/lambda-wrapper';
import { MEMBER_TYPE, MemberResponse } from './member';
import { InitiativeRecord } from './initiative';

const sns = new SNS({ apiVersion: '2010-03-31' });

export const handler = streamWrapper(async ({ versions, success, error }: StreamSignature) => {
  try {
    const newMembers = versions
      .filter(version => {
        const record = <InitiativeRecord>version.newVersion;
        return record.identifiers.indexOf(MEMBER_TYPE) > -1 && !version.oldVersion;
      })
      .map(record => new MemberResponse(record));
    await Promise.all(newMembers.map(member => publishNewMembersForNotifications(member)));
    success();
  } catch (err) {
    error(err);
  }
});

async function publishNewMembersForNotifications(member: MemberResponse): Promise<any> {
  const params = {
    Message: JSON.stringify(member),
    TopicArn: process.env.NOTIFY_ON_JOIN_SNS
  };
  return sns.publish(params).promise();
}
