import {
  Section,
  PlainText,
  MarkdownText,
  ImageContext,
  Button,
  StaticSelect,
  Action,
  Confirmation,
  ContextBlock,
  Overflow,
  Option
} from 'slack';
import { MemberResponse } from '../member';
import { InitiativeResponse } from '../initiative';
import { MEMBER_DISPLAY, MEMBER_ACTION_DISPLAY } from './display';
import { MemberAction } from '../interactions';

export class NameAndRoleSection implements Section {
  type: 'section' = 'section';
  text: PlainText | MarkdownText;
  accessory: Overflow;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const nameAndRole: MarkdownText = {
      type: 'mrkdwn',
      text: `*${MEMBER_DISPLAY[member.role].text}*  <@${member.slackUserId}> joined on ${member.joinedAt}`
    };
    this.text = nameAndRole;
    const memberActions = new MemberOverflowActions(member, initiative);
    this.accessory = memberActions;
  }
}

class MemberOverflowActions implements Overflow {
  type: 'overflow' = 'overflow';
  action_id: string;
  options: Option[];
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    this.action_id = MemberAction.UPDATE_MEMBERSHIP;
    const changeMembership = new ChangeMembershipOption(member, initiative);
    const remove = new RemoveOption(member, initiative);
    this.options = [changeMembership, remove];
  }
}

class ChangeMembershipOption implements Option {
  text: PlainText;
  value: string;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const action = member.champion ? MemberAction.MAKE_MEMBER : MemberAction.MAKE_CHAMPION;
    const champion = action === MemberAction.MAKE_CHAMPION;
    this.text = { text: MEMBER_ACTION_DISPLAY[action].text, type: 'plain_text' };
    this.value = JSON.stringify({ initiativeId: initiative.initiativeId, slackUserId: member.slackUserId, champion });
  }
}

class RemoveOption implements Option {
  text: PlainText;
  value: string;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const action = MemberAction.REMOVE_MEMBER;
    this.text = { text: MEMBER_ACTION_DISPLAY[action].text, type: 'plain_text' };
    this.value = JSON.stringify({
      initiativeId: initiative.initiativeId,
      slackUserId: member.slackUserId,
      remove: true
    });
  }
}

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
    this.elements = [changeMembership, remove];
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
