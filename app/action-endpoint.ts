import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Initiative } from './initiatives/initiative'
import { saveInitiative, getInitiativeByName } from './initiatives/initiative.service'
import { Status } from './initiatives/status'

export const handler = apiWrapper(async ({body, success, error} : ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload)
    console.log('Body', body);
    console.log('Payload', payload);
    console.log('Response url', payload.response_url);

    const userId = payload.user.id
    const name = payload.actions[0].value || 'Test-Initiative-Name';

    const initiative = new Initiative({
      'name': name,
      'creator': userId,
      'status': Status.WIP
    });

    await saveInitiative(initiative);

    const response = await getInitiativeByName(initiative.name)
    console.log('STORED INITIATIVE', response)

    const message = {
      text: 'Selection was received by slack!',
      attachments: [
        {
          text: 'This message is ephemeral and is only visible to you.',
        }
      ],
      response_type: 'in_channel'
    };

    console.log('Message is: ', message);
    success(message);
  } catch (err) {
    console.log('Error')
    error(err);
  }
});
