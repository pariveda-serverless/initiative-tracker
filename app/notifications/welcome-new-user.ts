import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';
import { WelcomeMessage } from '../slack-messages/welcome';
import { sendMessage } from '../slack-api';

export const handler = snsWrapper(async ({ message: user, success, error }: SnsSignature) => {
  try {
    const welcome = new WelcomeMessage(user);
    await sendMessage(welcome, user.teamdId);
    success();
  } catch (err) {
    error(err);
  }
});
