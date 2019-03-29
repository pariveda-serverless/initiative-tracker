import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Message, ActionPayload } from 'slack';
import { InitiativeAction, MemberAction } from './interactions';
import { replyWithMessage } from '../slack-api';
import { NotImplementedResponse } from '../slack-messages';
import { joinInitiativeAction } from './join-initiative';
import { getInitiativeDetailsAction } from './get-initiative-details';
import { updateStatusAction } from './update-status';
import { editInitiativeAction } from './edit-initiative';
import { remainMemberAction } from './remain-member';
import { parseValue, stringifyValue } from './id-helper';
import { deleteInitiativeAction } from './delete-initiative';
import { openEditDialogAction } from './open-edit-dialog';
import { changeMembershipAction } from './change-membership';
import { leaveInitiativeAction } from './leave-initiative';
import { openAddMemberDialogAction } from './open-add-member-dialog';
import { addMemberAction } from './add-member';
import { getInitiativeListAction } from './get-initiative-list';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    let response: Message;
    const { payload, teamId, responseUrl, channel, action, triggerId, queryId } = getFieldsFromBody(body);
    switch (action) {
      case InitiativeAction.VIEW_DETAILS: {
        response = await getInitiativeDetailsAction(teamId, channel, queryId, payload);
        break;
      }
      case InitiativeAction.VIEW_LIST: {
        response = await getInitiativeListAction(teamId, channel, queryId, payload);
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
      case InitiativeAction.OPEN_ADD_MEMBER_DIALOG: {
        await openAddMemberDialogAction(teamId, channel, payload, triggerId);
        break;
      }
      case InitiativeAction.ADD_MEMBER: {
        response = await addMemberAction(teamId, channel, payload);
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
        response = await leaveInitiativeAction(teamId, channel, payload);
        break;
      }
      case MemberAction.MAKE_CHAMPION:
      case MemberAction.MAKE_MEMBER: {
        response = await changeMembershipAction(teamId, channel, payload);
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
      if (queryId && response.blocks && response.blocks.length > 0) {
        response.blocks[0].block_id = stringifyValue({ queryId });
      }
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
  const queryId = getQueryId(payload);
  return { payload, teamId, responseUrl, channel, action, triggerId, queryId };
}

function getAction(payload: ActionPayload): InitiativeAction | MemberAction {
  const callbackAction = payload.callback_id;
  const buttonAction = payload.actions && payload.actions.length > 0 && payload.actions[0].action_id;
  const option =
    payload.actions &&
    payload.actions.length &&
    payload.actions[0].selected_option &&
    parseValue(payload.actions[0].selected_option.value);
  const action = (option && option.action) || buttonAction || callbackAction;
  console.log('Action', action);
  return action;
}

function getQueryId(payload: ActionPayload): string {
  let queryId;
  const blocks = payload.message && payload.message.blocks;
  if (blocks) {
    // Find the block that has a JSON payload for the block_id - that's the one with the query Id in it
    blocks.find(block => {
      try {
        queryId = parseValue(block.block_id).queryId;
        return true;
      } catch (err) {
        return false;
      }
    });
  }
  return queryId;
}
