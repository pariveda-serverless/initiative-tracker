import { InitiativeResponse } from '../initiative';
import { STATUS_DISPLAY, INTENT_DISPLAY } from './display';
import { Intent, Action } from '../interactions';

export class ListResponse {
  text: string;
  response_type: string;
  attachments: BasicInitiativeResponse[];
  constructor(initiatives: InitiativeResponse[]) {
    this.text = 'Here are all the initiatives';
    this.response_type = 'in_channel'; //TODO what are the other options?
    this.attachments = initiatives.map(initiative => new BasicInitiativeResponse(initiative));
  }
}

class BasicInitiativeResponse {
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: Field[];
  actions: JoinButton[];

  constructor(initiative: InitiativeResponse) {
    this.text = initiative.name;
    this.color = STATUS_DISPLAY[initiative.status].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = Action.LIST_ACTIONS;
    this.actions = Object.values(Intent).map(intent => new JoinButton(initiative, intent));
  }
}

class Field {
  title: string;
  value: string;
  short: boolean;
}

class JoinButton {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;

  constructor(initiative: InitiativeResponse, intent: Intent) {
    this.name = intent;
    this.style = INTENT_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = INTENT_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
  }
}
