import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Message, ActionPayload } from 'slack';
import * as id from 'nanoid';
import { InitiativeAction, MemberAction } from './interactions';
import { replyWithMessage } from '../slack-api';
import { NotImplementedResponse } from '../slack-messages';
import { joinInitiativeAction } from './join-initiative';
import { getInitiativeDetailsAction } from './get-initiative-details';
import { updateStatusAction } from './update-status';
import { editInitiativeAction } from './edit-initiative';
import { remainMemberAction } from './remain-member';
import { parseValue, stringifyValue, Value } from './id-helper';
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
    let { payload, teamId, responseUrl, channel, action, triggerId, queryId } = getFieldsFromBody(body);
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
        await openEditDialogAction(teamId, channel, queryId, payload, triggerId, responseUrl);
        break;
      }
      case InitiativeAction.EDIT_INITIATIVE: {
        ({ response, responseUrl } = await editInitiativeAction(teamId, channel, payload));
        break;
      }
      case InitiativeAction.OPEN_ADD_MEMBER_DIALOG: {
        await openAddMemberDialogAction(teamId, channel, queryId, payload, triggerId, responseUrl);
        break;
      }
      case InitiativeAction.ADD_MEMBER: {
        ({ response, responseUrl } = await addMemberAction(teamId, channel, payload));
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
      await sendResponse(response, responseUrl, queryId);
    }
    success();
  } catch (err) {
    error(err);
  }
});

async function sendResponse(response: Message, responseUrl: string, queryId: string): Promise<any> {
  if (queryId && response.blocks && response.blocks.length > 0) {
    console.log(`Adding queryId ${queryId} to all message blocks`);
    response.blocks.forEach(block => (block.block_id = stringifyValue({ blockId: id(), queryId })));
  }
  console.log('Replying with response', JSON.stringify(response));
  await replyWithMessage(responseUrl, response as Message);
}

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
  const option = getOption(payload);
  const action = (option && option.action) || buttonAction || callbackAction;
  console.log('Action', action);
  return action;
}

function getOption(payload: ActionPayload): Value {
  let option: Value;
  try {
    option =
      payload.actions &&
      payload.actions.length &&
      payload.actions[0].selected_option &&
      payload.actions[0].selected_option.value &&
      parseValue(payload.actions[0].selected_option.value);
  } catch (err) {
    console.error(`Couldn't get action from option`, option, err);
  }
  return option;
}

function getQueryId(payload: ActionPayload): string {
  let queryId;
  if (!queryId && payload.message && payload.message.blocks) {
    // Find the block that has a JSON payload for the block_id - that's the one with the query Id in it
    queryId = getQueryIdFromElements(payload.message.blocks);
  }
  if (!queryId && payload.actions) {
    queryId = getQueryIdFromElements(payload.actions);
  }
  return queryId;
}

function getQueryIdFromElements(elements: any[]): string {
  let queryId;
  elements.find(element => {
    try {
      queryId = parseValue(element.value).queryId;
    } catch (err) {}
    try {
      queryId = parseValue(element.block_id).queryId;
      return true;
    } catch (err) {}
    return queryId;
  });
  return queryId;
}
