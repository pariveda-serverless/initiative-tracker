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
import { MEMBER_DISPLAY, MEMBER_INTENT_DISPLAY } from './display';
import { ActionType, MemberIntent } from '../interactions';

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
    this.elements = Object.values(MemberIntent)
      .filter(intent => (member.champion ? intent !== MemberIntent.MAKE_CHAMPION : intent !== MemberIntent.MAKE_MEMBER))
      .map(intent => new ActionButton(member, initiative, intent));
  }
}

class ActionButton implements Button {
  type: 'button' = 'button';
  text: PlainTextObject;
  action_id: string;
  value?: string;
  confirm?: Confirmation;
  constructor(member: MemberResponse, initiative: InitiativeResponse, intent: MemberIntent) {
    this.action_id = intent;
    this.value = JSON.stringify({ initiativeId: initiative.initiativeId, slackUserId: member.slackUserId });
    this.text = {
      type: 'plain_text',
      text: MEMBER_INTENT_DISPLAY[intent].text
    };
    this.confirm = new ConfirmAction(member, intent);
  }
}

class ConfirmAction implements Confirmation {
  title: PlainTextObject;
  text: PlainTextObject | MarkdownTextObject;
  confirm: PlainTextObject;
  deny: PlainTextObject;
  constructor(member: MemberResponse, intent: MemberIntent) {
    const { verb, action, title } = MEMBER_INTENT_DISPLAY[intent].confirmation;
    this.title = {
      type: 'plain_text',
      text: title
    };
    this.text = {
      type: 'mrkdwn',
      text: `Are you sure you want to ${verb} ${member.name} ${action}?`
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
