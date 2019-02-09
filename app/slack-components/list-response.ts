import { InitiativeResponse } from '../initiative';
import { STATUS_DISPLAY, INITIATIVE_INTENT_DISPLAY } from './display';
import { InitiativeIntent, Action } from '../interactions';
import { SlackAttachment, SlackField, SlackAction } from './interfaces';

export class ListResponse {
  text: string;
  response_type: string;
  attachments: SlackAttachment[];
  constructor(initiatives: InitiativeResponse[]) {
    this.text = 'Here are all the initiatives';
    this.response_type = 'in_channel'; //TODO what are the other options?
    this.attachments = initiatives.map(initiative => new BasicInitiativeCard(initiative));
  }
}

class BasicInitiativeCard implements SlackAttachment {
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: SlackField[];
  actions: SlackAction[];

  constructor(initiative: InitiativeResponse) {
    this.text = initiative.name;
    this.color = STATUS_DISPLAY[initiative.status].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = Action.INITIATIVE_ACTION;
    this.actions = Object.values(InitiativeIntent).map(intent => new InitiativeAction(initiative, intent));
  }
}

export class InitiativeAction implements SlackAction {
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
