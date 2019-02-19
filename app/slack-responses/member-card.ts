import {
  SectionBlock,
  PlainTextObject,
  MarkdownTextObject,
  Image,
  Button,
  StaticSelect,
  ActionsBlock,
  Confirmation
} from 'slack';
import { MemberResponse } from '../member';
import { InitiativeResponse } from '../initiative';
import { MEMBER_DISPLAY, MEMBER_ACTION_DISPLAY } from './display';
import { MemberAction } from '../interactions';

export class NameAndRole implements SectionBlock {
  type: 'section' = 'section';
  fields?: (PlainTextObject | MarkdownTextObject)[];
  accessory?: Image | Button | StaticSelect;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const name: MarkdownTextObject = {
      type: 'mrkdwn',
      text: `*Name*\n${member.name}`
    };
    const role: MarkdownTextObject = {
      type: 'mrkdwn',
      text: `*Role*\n${MEMBER_DISPLAY[member.role].text}`
    };
    this.fields = [name, role];
    this.accessory = { type: 'image', image_url: member.icon, alt_text: 'profile' };
  }
}

export class MemberActions implements ActionsBlock {
  type: 'actions' = 'actions';
  elements: Button[];
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    this.elements = Object.values(MemberAction)
      .filter(intent => (member.champion ? intent !== MemberAction.MAKE_CHAMPION : intent !== MemberAction.MAKE_MEMBER))
      .map(intent => new ActionButton(member, initiative, intent));
  }
}

class ActionButton implements Button {
  type: 'button' = 'button';
  text: PlainTextObject;
  action_id: string;
  value?: string;
  confirm?: Confirmation;
  constructor(member: MemberResponse, initiative: InitiativeResponse, action: MemberAction) {
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
  title: PlainTextObject;
  text: PlainTextObject | MarkdownTextObject;
  confirm: PlainTextObject;
  deny: PlainTextObject;
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
