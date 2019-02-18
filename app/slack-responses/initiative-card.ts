import {
  SectionBlock,
  StaticSelect,
  Image,
  Button,
  ActionsBlock,
  PlainTextObject,
  Option,
  MarkdownTextObject,
  DividerBlock,
  ContextBlock
} from 'slack';
import { InitiativeResponse } from '../initiative';
import { STATUS_DISPLAY, INITIATIVE_INTENT_DISPLAY } from './display';
import { InitiativeIntent } from '../interactions';
import { Status } from '../status';

export class InitiativeNameAndStatus implements SectionBlock {
  type: 'section' = 'section';
  fields?: (PlainTextObject | MarkdownTextObject)[];
  constructor(initiative: InitiativeResponse) {
    const name: MarkdownTextObject = {
      type: 'mrkdwn',
      text: `*Name*\n${initiative.name}`
    };
    const status: MarkdownTextObject = {
      type: 'mrkdwn',
      text: `*Status*\n${STATUS_DISPLAY[initiative.status].text}`
    };
    this.fields = [name, status];
  }
}

export class InitiativeNameStatusAndUpdateStatus implements SectionBlock {
  type: 'section' = 'section';
  fields?: (PlainTextObject | MarkdownTextObject)[];
  accessory?: Image | Button | StaticSelect;
  constructor(initiative: InitiativeResponse) {
    const name: MarkdownTextObject = {
      type: 'mrkdwn',
      text: `*Name*\n${initiative.name}`
    };
    const status: MarkdownTextObject = {
      type: 'mrkdwn',
      text: `*Status*\n${STATUS_DISPLAY[initiative.status].text}`
    };
    this.fields = [name, status];
    this.accessory = new StatusUpdate();
  }
}

export class MetaInformation implements ContextBlock {
  type: 'context' = 'context';
  elements: (Image | PlainTextObject | MarkdownTextObject)[];
  constructor(initiative: InitiativeResponse) {
    const createdByIcon: Image = {
      type: 'image',
      image_url: initiative.createdByIcon,
      alt_text: 'img'
    };
    const createdBy: MarkdownTextObject = {
      type: 'mrkdwn',
      text: `Created by ${initiative.createdBy} on ${initiative.createdAt}`
    };
    this.elements = [createdByIcon, createdBy];
  }
}

export class InitiativeDescription implements SectionBlock {
  type: 'section' = 'section';
  text: PlainTextObject | MarkdownTextObject;
  constructor(initiative: InitiativeResponse) {
    this.text = {
      type: 'mrkdwn',
      text: `*Description*\n${initiative.description}`
    };
  }
}

export class InitiativeDetailActions implements ActionsBlock {
  type: 'actions' = 'actions';
  elements: (StaticSelect | Button)[];
  constructor(initiative: InitiativeResponse) {
    this.elements = Object.values(InitiativeIntent)
      // Don't show view details, already viewing details
      .filter(intent => intent !== InitiativeIntent.VIEW_DETAILS)
      .map(intent => new ActionButton(initiative, intent));
  }
}

export class InitiativeListActions implements ActionsBlock {
  type: 'actions' = 'actions';
  elements: (StaticSelect | Button)[];
  constructor(initiative: InitiativeResponse) {
    this.elements = Object.values(InitiativeIntent).map(intent => new ActionButton(initiative, intent));
  }
}

class ActionButton implements Button {
  type: 'button' = 'button';
  text: PlainTextObject;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse, intent: InitiativeIntent) {
    this.action_id = intent;
    this.value = JSON.stringify({ initiativeId: initiative.initiativeId });
    this.text = {
      type: 'plain_text',
      text: INITIATIVE_INTENT_DISPLAY[intent].text
    };
  }
}

export class Divider implements DividerBlock {
  type: 'divider' = 'divider';
}

export class StatusUpdate implements StaticSelect {
  type: 'static_select' = 'static_select';
  placeholder: PlainTextObject;
  action_id: string;
  options: Option[];
  constructor() {
    this.placeholder = { type: 'plain_text', text: 'Update status' };
    this.options = Object.values(Status).map(status => new StatusOption(status));
  }
}

class StatusOption implements Option {
  text: PlainTextObject;
  value: string;
  constructor(status: Status) {
    this.text = { text: STATUS_DISPLAY[status].text, type: 'plain_text' };
    this.value = status;
  }
}
