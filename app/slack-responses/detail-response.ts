import { Message, Attachment, Field, Action, ConfirmAction } from 'slack';
import { InitiativeResponse } from '../initiative';
import { MEMBER_INTENT_DISPLAY, STATUS_DISPLAY, INITIATIVE_INTENT_DISPLAY, MEMBER_DISPLAY } from './display';
import { InitiativeIntent, ActionType, MemberIntent } from '../interactions';
import { MemberResponse } from '../member';

export class DetailResponse implements Message {
  response_type: 'in_channel' | 'ephemeral';
  attachments: Attachment[];
  constructor(initiative: InitiativeResponse) {
    this.response_type = 'ephemeral';
    const initiativeCard = new BasicInitiativeCard(initiative);
    const members = initiative.members.map(member => new MemberCard(member, initiative));
    this.attachments = [initiativeCard, ...members];
    // TODO add an attachment for initiative itself, wich intents being join and join (no view details)
  }
}

class BasicInitiativeCard implements Attachment {
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: Field[];
  actions: Action[];

  constructor(initiative: InitiativeResponse) {
    this.color = STATUS_DISPLAY[initiative.status].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = ActionType.INITIATIVE_ACTION;
    const name = new Name(initiative);
    const status = new Status(initiative);
    const description = new Description(initiative);
    this.fields = [name, status, description];
    this.actions = Object.values(InitiativeIntent).map(intent => new InitiativeAction(initiative, intent));
  }
}

class Description implements Field {
  title: string;
  value: string;
  short: boolean;
  constructor(initiative: InitiativeResponse) {
    this.title = 'Description';
    this.value = initiative.description;
    this.short = false;
  }
}

class Status implements Field {
  title: string;
  value: string;
  short: boolean;
  constructor(initiative: InitiativeResponse) {
    this.title = 'Status';
    this.value = STATUS_DISPLAY[initiative.status].text;
    this.short = true;
  }
}

class Name implements Field {
  title: string;
  value: string;
  short: boolean;
  constructor(initiative: InitiativeResponse) {
    this.title = 'Name';
    this.value = initiative.name;
    this.short = true;
  }
}

class MemberCard implements Attachment {
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: Field[];
  actions: Action[];

  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    this.text = member.name;
    const memberType = member.champion ? 'CHAMPION' : 'MEMBER';
    this.color = MEMBER_DISPLAY[memberType].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = ActionType.MEMBER_ACTION;
    this.actions = Object.values(MemberIntent)
      .filter(intent => (member.champion ? intent !== MemberIntent.MAKE_CHAMPION : intent !== MemberIntent.MAKE_MEMBER))
      .map(intent => new MemberAction(member, initiative, intent));
  }
}

class MemberAction implements Action {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;
  confirm: ConfirmAction;

  constructor(member: MemberResponse, initiative: InitiativeResponse, intent: MemberIntent) {
    this.name = intent;
    this.style = MEMBER_INTENT_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = MEMBER_INTENT_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
    this.confirm = new MemberActionConfirmation(member, intent);
  }
}

class MemberActionConfirmation implements ConfirmAction {
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

class InitiativeAction implements Action {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;

  constructor(initiative: InitiativeResponse, intent: InitiativeIntent) {
    this.name = intent;
    this.style = INITIATIVE_INTENT_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = INITIATIVE_INTENT_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
  }
}
