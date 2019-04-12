import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';
import { WelcomeMessage } from '../slack-messages/welcome';
import { sendMessage } from '../slack-api';
import { User } from '../users';

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
    const user = <User>message;
    const welcome = new WelcomeMessage(user);
    await sendMessage(welcome, user.teamId);
    success();
  } catch (err) {
    error(err);
  }
});
