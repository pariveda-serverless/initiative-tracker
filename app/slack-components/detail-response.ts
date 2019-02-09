import { InitiativeResponse } from '../initiative';
import { MEMBER_INTENT_DISPLAY, INITIATIVE_INTENT_DISPLAY, MEMBER_DISPLAY } from './display';
import { InitiativeIntent, Action, MemberIntent } from '../interactions';
import { MemberResponse } from '../member';
import { SlackAttachment, SlackField, SlackAction, SlackConfirmAction } from './interfaces';

export class DetailResponse {
  text: string;
  response_type: string;
  attachments: SlackAttachment[];
  constructor(initiative: InitiativeResponse) {
    this.text = initiative.name;
    this.response_type = 'in_channel'; //TODO what are the other options?
    this.attachments = initiative.members.map(member => new MemberCard(member, initiative));
    // TODO add an attachment for initiative itself, wich intents being join and join (no view details)
  }
}

class MemberCard implements SlackAttachment {
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: SlackField[];
  actions: SlackAction[];

  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    this.text = member.name;
    const memberType = member.champion ? 'CHAMPION' : 'MEMBER';
    this.color = MEMBER_DISPLAY[memberType].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = Action.MEMBER_ACTION;
    this.actions = Object.values(MemberIntent)
      .filter(intent => (member.champion ? intent !== MemberIntent.MAKE_CHAMPION : intent !== MemberIntent.MAKE_MEMBER))
      .map(intent => new MemberAction(member, initiative, intent));
  }
}

class MemberAction implements SlackAction {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;
  confirm: SlackConfirmAction;

  constructor(member: MemberResponse, initiative: InitiativeResponse, intent: MemberIntent) {
    this.name = intent;
    this.style = MEMBER_INTENT_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = MEMBER_INTENT_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
    this.confirm = new MemberActionConfirmation(member, intent);
  }
}

class MemberActionConfirmation implements SlackConfirmAction {
  title: string;
  text: string;
  ok_text: string = 'Yes';
  dismiss_text: string = 'No';

  constructor(member: MemberResponse, intent: MemberIntent) {
    const { verb, action, title } = MEMBER_INTENT_DISPLAY[intent].confirmation;
    this.title = title;
    this.text = `Are you sure you want to ${verb} ${member.name} ${action}?`;
  }
}
