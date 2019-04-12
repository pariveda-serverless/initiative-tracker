import { StreamSignature, streamWrapper } from '@manwaring/lambda-wrapper';
import { sns } from '../shared';
import { User } from '../users';

export const handler = streamWrapper(async ({ versions, success, error }: StreamSignature) => {
  try {
    const newUsers = versions
      // .filter(version => version.newVersion && !version.oldVersion)
      .map(version => new User(version.newVersion));
    await Promise.all(newUsers.map(member => publishWelcomeNewUserNotification(member)));
    success();
  } catch (err) {
    error(err);
  }
});

async function publishWelcomeNewUserNotification(user: User): Promise<any> {
  const params = {
    Message: JSON.stringify(user),
    TopicArn: process.env.WELCOME_NEW_USER_SNS
  };
  console.log('Publishing new user notification with params', params);
  return sns.publish(params).promise();
}
