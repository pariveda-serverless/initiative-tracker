import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';

import { joinInitiative } from './initiatives/initiative.service'

import { Roles } from './users/roles'
import { User } from './users/user'

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {

    const payload = JSON.parse(body.payload);
    const selection = payload.actions[0].value;
    const role = selection.split(':')[0];
    const initiativeId = selection.split(':')[1];
    console.log('Payload', payload);

    const user = new User ({
      slackId: payload.user.id,
      role: role,
    })

    await joinInitiative(initiativeId, user);

    const message = {
      text: `User ${user.slackId}  joined initiative ${initiativeId} as a ${user.role}!`,
      response_type: 'in_channel'
    };

    console.log('Message is ', JSON.stringify(message));
    success(message);
  } catch (err) {
    error(err);
  }
});
