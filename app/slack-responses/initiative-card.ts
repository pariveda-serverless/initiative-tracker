import { Attachment, Field, Action } from 'slack';
import { InitiativeResponse } from '../initiative';
import { STATUS_DISPLAY, INITIATIVE_INTENT_DISPLAY } from './display';
import { ActionType, InitiativeIntent } from '../interactions';

export class BasicInitiativeCard implements Attachment {
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: Field[];
  actions: Action[];
  footer: string;
  footer_icon: string;

  constructor(initiative: InitiativeResponse) {
    this.color = STATUS_DISPLAY[initiative.status].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = ActionType.INITIATIVE_ACTION;
    const name = new Name(initiative);
    const status = new Status(initiative);
    const description = new Description(initiative);
    this.fields = [name, status, description];
    this.actions = Object.values(InitiativeIntent).map(intent => new InitiativeAction(initiative, intent));
    this.footer = `Created by ${initiative.createdBy} on ${initiative.createdAt}`;
    this.footer_icon = initiative.createdByIcon;
  }
}

export class DetailedInitiativeCard implements Attachment {
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: Field[];
  actions: Action[];
  footer: string;
  footer_icon: string;

  constructor(initiative: InitiativeResponse, slackUserId: string) {
    this.color = STATUS_DISPLAY[initiative.status].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = ActionType.INITIATIVE_ACTION;
    const name = new Name(initiative);
    const status = new Status(initiative);
    const description = new Description(initiative);
    this.fields = [name, status, description];
    // Only show the join buttons if user isn't already a member
    if (!initiative.members.find(member => member.slackUserId === slackUserId)) {
      this.actions = Object.values(InitiativeIntent)
        // Never show the view details button because already on details view
        .filter(intent => intent !== InitiativeIntent.VIEW_DETAILS)
        .map(intent => new InitiativeAction(initiative, intent));
    }
    this.footer = `Created by ${initiative.createdBy} on ${initiative.createdAt}`;
    this.footer_icon = initiative.createdByIcon;
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
