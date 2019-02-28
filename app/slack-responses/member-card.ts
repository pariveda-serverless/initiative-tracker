import {
  Section,
  PlainText,
  MarkdownText,
  ImageContext,
  Button,
  StaticSelect,
  Action,
  Confirmation,
  ContextBlock
} from 'slack';
import { MemberResponse } from '../member';
import { InitiativeResponse } from '../initiative';
import { MEMBER_DISPLAY, MEMBER_ACTION_DISPLAY, INITIATIVE_ACTION_DISPLAY } from './display';
import { MemberAction, InitiativeAction } from '../interactions';

export class NameAndRole implements ContextBlock {
  type: 'context' = 'context';
  elements: (ImageContext | PlainText | MarkdownText)[];
  constructor(member: MemberResponse) {
    const role: MarkdownText = {
      type: 'mrkdwn',
      text: `*${MEMBER_DISPLAY[member.role].text}*`
    };
    const icon: ImageContext = {
      type: 'image',
      image_url: member.icon,
      alt_text: member.name
    };
    const joined: MarkdownText = {
      type: 'mrkdwn',
      text: `<@${member.slackUserId}> joined on ${member.joinedAt}`
    };
    this.elements = [role, icon, joined];
  }
}

export class MemberActions implements Action {
  type: 'actions' = 'actions';
  elements: Button[];
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const changeMembership = new ChangeMembershipActionButton(member, initiative);
    const remove = new RemoveMembershipActionButton(member, initiative);
    const edit = new EditInitiativeActionButton(initiative);
    this.elements = [changeMembership, remove, edit];
  }
}

class ChangeMembershipActionButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  confirm?: Confirmation;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const action = member.champion ? MemberAction.MAKE_MEMBER : MemberAction.MAKE_CHAMPION;
    this.action_id = action;
    this.value = JSON.stringify({ initiativeId: initiative.initiativeId, slackUserId: member.slackUserId });
    this.text = {
      type: 'plain_text',
      text: MEMBER_ACTION_DISPLAY[action].text
    };
    this.confirm = new ConfirmAction(member, action);
  }
}

class RemoveMembershipActionButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  confirm?: Confirmation;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const action = MemberAction.REMOVE_MEMBER;
    this.action_id = action;
    this.value = JSON.stringify({ initiativeId: initiative.initiativeId, slackUserId: member.slackUserId });
    this.text = {
      type: 'plain_text',
      text: MEMBER_ACTION_DISPLAY[action].text
    };
    this.confirm = new ConfirmAction(member, action);
  }
}

class EditInitiativeActionButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    const action = MemberAction.OPEN_EDIT_DIALOG;
    this.action_id = action;
    this.value = JSON.stringify({ initiativeId: initiative.initiativeId });
    this.text = {
      type: 'plain_text',
      text: INITIATIVE_ACTION_DISPLAY[action].text
    };
  }
}

class ConfirmAction implements Confirmation {
  title: PlainText;
  text: PlainText | MarkdownText;
  confirm: PlainText;
  deny: PlainText;
  constructor(member: MemberResponse, action: MemberAction) {
    const { verb, noun, title } = MEMBER_ACTION_DISPLAY[action].confirmation;
    this.title = {
      type: 'plain_text',
      text: title
    };
    this.text = {
      type: 'mrkdwn',
      text: `Are you sure you want to ${verb} ${member.name} ${noun}?`
    };
    this.confirm = {
      type: 'plain_text',
      text: 'Yes'
    };
    this.deny = {
      type: 'plain_text',
      text: 'No'
    };
  }
}
