import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Message, ActionPayload } from 'slack';
import { InitiativeAction, MemberAction } from './interactions';
import { replyWithMessage } from '../slack-api';
import { NotImplementedResponse, EditInitiativeDialog } from '../slack-messages';
import { joinInitiativeAction } from './join-initiative';
import { getInitiativeDetailsAction } from './get-initiative-details';
import { updateStatusAction } from './update-status';
import { editInitiativeAction } from './edit-initiative';
import { remainMemberAction } from './remain-member';
import { parseValue } from './id-helper';
import { deleteInitiativeAction } from './delete-initiative';
import { openEditDialogAction } from './open-edit-dialog';
import { changeMembershipAction } from './change-membership';
import { leaveInitiativeAction } from './leave-initiative';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    let response: Message | EditInitiativeDialog;
    const { payload, teamId, responseUrl, channel, action, triggerId } = getFieldsFromBody(body);
    switch (action) {
      case InitiativeAction.VIEW_DETAILS: {
        response = await getInitiativeDetailsAction(teamId, channel, payload);
        break;
      }
      case InitiativeAction.DELETE: {
        response = await deleteInitiativeAction(teamId, channel, payload);
        break;
      }
      case InitiativeAction.OPEN_EDIT_DIALOG: {
        await openEditDialogAction(teamId, channel, payload, triggerId);
        break;
      }
      case InitiativeAction.EDIT_INITIATIVE: {
        response = await editInitiativeAction(teamId, channel, payload);
        break;
      }
      case InitiativeAction.UPDATE_STATUS:
      case InitiativeAction.MARK_ON_HOLD:
      case InitiativeAction.MARK_ABANDONED:
      case InitiativeAction.MARK_COMPLETE:
      case InitiativeAction.MARK_ACTIVE: {
        response = await updateStatusAction(teamId, channel, payload);
        break;
      }
      case InitiativeAction.JOIN_AS_MEMBER:
      case InitiativeAction.JOIN_AS_CHAMPION: {
        response = await joinInitiativeAction(teamId, channel, payload);
        break;
      }
      case MemberAction.REMOVE_MEMBER: {
        await leaveInitiativeAction(teamId, channel, payload);
        break;
      }
      case MemberAction.MAKE_CHAMPION:
      case MemberAction.MAKE_MEMBER: {
        await changeMembershipAction(teamId, channel, payload);
        break;
      }
      case MemberAction.REMAIN_MEMBER: {
        response = await remainMemberAction(teamId, channel, payload);
        break;
      }
      default: {
        response = new NotImplementedResponse(channel);
        break;
      }
    }
    if (response) {
      console.log('Replying with response', JSON.stringify(response));
      await replyWithMessage(responseUrl, response as Message);
    }
    success();
  } catch (err) {
    error(err);
  }
});

function getFieldsFromBody(body: any) {
  const payload: ActionPayload = JSON.parse(body.payload);
  const teamId = payload.team.id;
  const responseUrl = payload.response_url;
  const channel = payload.channel.id;
  const action = getAction(payload);
  const triggerId = payload.trigger_id;
  return { payload, teamId, responseUrl, channel, action, triggerId };
}

function getAction(payload: ActionPayload): InitiativeAction | MemberAction {
  const callbackAction = payload.callback_id;
  const buttonAction = payload.actions && payload.actions.length > 0 && payload.actions[0].action_id;
  const option =
    payload.actions &&
    payload.actions.length &&
    payload.actions[0].selected_option &&
    parseValue(payload.actions[0].selected_option.value);
  return buttonAction || callbackAction || (option && option.action);
}
