import { Attachment, Field, Action } from 'slack';
import { InitiativeResponse } from '../initiative';
import { StatusUpdateIntent, ActionType } from '../interactions';
import { STATUS_DISPLAY, STATUS_UPDATE_DISPLAY } from './display';

export class StatusUpdateRequest implements Attachment {
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
    this.callback_id = ActionType.STATUS_UPDATE;
    const name = new Name(initiative);
    const status = new Status(initiative);
    const description = new Description(initiative);
    this.fields = [name, status, description];
    this.actions = Object.values(StatusUpdateIntent).map(intent => new StatusUpdateAction(initiative, intent));
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

class StatusUpdateAction implements Action {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;

  constructor(initiative: InitiativeResponse, intent: StatusUpdateIntent) {
    this.name = intent;
    this.style = STATUS_UPDATE_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = STATUS_UPDATE_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
  }
}
