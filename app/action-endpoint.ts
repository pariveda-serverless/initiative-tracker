import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Actions } from './action-types';
import { joinInitiative } from './join-initiative';
import { CreateMemberRequest } from './initiative';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload);
    console.log('Payload', payload);
    // Read Action Type
    let message: any;
    const callback_id = payload.callback_id;
    switch (callback_id) {
      case Actions.JOIN_INITIATIVE:
        message = await joinInitiativeHalder(payload);
        break;
      default:
        break;
    }

    console.log('Message is: ', message);
    success(message);
  } catch (err) {
    console.log('Error');
    error(err);
  }
});

const joinInitiativeHalder = async (body: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('BODY INSIDE HANDLER', body);
      const selection = body.actions[0].value;
      const role = selection.split(':')[0];
      const initiativeId = selection.split(':')[1];

      const member = new CreateMemberRequest({
        initiativeId,
        slackUserId: body.user.id,
        name: 'TODO',
        champion: role && role === 'CHAMPION'
      });

      await joinInitiative(member);

      const message = {
        text: `User ${member.slackUserId}  joined initiative ${initiativeId} as a ${
          member.champion ? 'champion' : 'member'
        }!`,
        response_type: 'in_channel'
      };
      console.log('Message is ', JSON.stringify(message));
      resolve(message);
    } catch (err) {
      reject(err);
    }
  });
};
