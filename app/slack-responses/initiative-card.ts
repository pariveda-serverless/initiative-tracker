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

  constructor(initiative: InitiativeResponse, details: boolean) {
    this.color = STATUS_DISPLAY[initiative.status].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = ActionType.INITIATIVE_ACTION;
    const name = new Name(initiative);
    const status = new Status(initiative);
    const description = new Description(initiative);
    this.fields = [name, status, description];
    this.actions = Object.values(InitiativeIntent)
      // Don't show the view details button when already looking at details
      .filter(intent => !details || intent !== InitiativeIntent.VIEW_DETAILS)
      .map(intent => new InitiativeAction(initiative, intent));
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
