import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Action, Intent } from './interactions';
import { joinInitiative } from './join-initiative';
import { CreateMemberRequest } from './initiative';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const payload = JSON.parse(body.payload);
    const { callback_id: action } = payload;
    let response: any;
    switch (action) {
      case Action.JOIN:
        response = await joinInitiativeHandler(payload);
        break;
      default:
        break;
    }
    success(response);
  } catch (err) {
    error(err);
  }
});

async function joinInitiativeHandler(body: any): Promise<any> {
  const initiativeId: string = body.actions[0].value;
  const intent: Intent = body.actions[0].name;

  const member = new CreateMemberRequest({
    initiativeId,
    slackUserId: body.user.id,
    name: body.user.name,
    champion: intent === Intent.JOIN_AS_CHAMPION
  });

  await joinInitiative(member);

  const message = {
    text: `User ${member.name}  joined initiative ${initiativeId} as a ${member.champion ? 'champion' : 'member'}!`,
    response_type: 'in_channel'
  };
  return message;
}
