import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Initiative } from './initiatives/initiative'
import { User } from './users/user'
import { saveInitiative, getInitiativeByName, joinInitiative } from './initiatives/initiative.service'
import { Actions } from './action-types'


export const handler = apiWrapper(async ({body, success, error} : ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload);
    console.log('Payload', payload);
    // Read Action Type
    let message: any;
    const callback_id = payload.callback_id;
    switch(callback_id) {
      case Actions.JOIN_INITIATIVE:
        message = await joinInitiativeHalder(payload);
        break;
      default:
        break;
    }

    console.log('Message is: ', message);
    success(message);
  } catch (err) {
    console.log('Error')
    error(err);
  }
});

const joinInitiativeHalder = async (body: any): Promise<any> => {
  return new Promise(async (resolve, reject) =>{
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
      resolve(message);
    } catch (err) {
      reject(err);
    }
  });
};