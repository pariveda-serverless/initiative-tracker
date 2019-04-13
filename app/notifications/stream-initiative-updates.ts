import { StreamSignature, streamWrapper } from '@manwaring/lambda-wrapper';
import { MEMBER_TYPE, Member } from '../members';
import { InitiativeRecord } from '../initiatives';
import { sns } from '../shared';

export const handler = streamWrapper(async ({ versions, success, error }: StreamSignature) => {
  try {
    const newMembers = versions
      .filter(version => {
        const record = <InitiativeRecord>version.newVersion;
        return record && record.identifiers.indexOf(MEMBER_TYPE) > -1 && !version.oldVersion;
      })
      .map(version => new Member(version.newVersion));
    // const removedMembers = versions.filter(version => {
    //   const record = <InitiativeRecord>version.oldVersion;
    //   return record && record.identifiers.indexOf(MEMBER_TYPE) > -1 && !version.newVersion;
    // });
    await Promise.all(newMembers.map(member => publishNewMembersForNotifications(member)));
    // await Promise.all(removedMembers.map(member => publishRemovedMembersForNotifications(members)));
    success();
  } catch (err) {
    error(err);
  }
});

async function publishNewMembersForNotifications(member: Member): Promise<any> {
  const params = {
    Message: JSON.stringify(member),
    TopicArn: process.env.NOTIFY_ON_JOIN_SNS
  };
  console.log('Publishing new member notification with params', params);
  return sns.publish(params).promise();
}

// async function publishRemovedMembersForNotifications(member: Member): Promise<any> {
//   const params = {
//     Message: JSON.stringify(member),
//     TopicArn: process.env.NOTIFY_ON_LEAVE_SNS
//   };
//   console.log('Publishing removed member notification with params', params);
//   return sns.publish(params).promise();
// }
