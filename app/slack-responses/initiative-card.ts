import {
  SectionBlock,
  StaticSelect,
  Image,
  Button,
  ActionsBlock,
  PlainTextObject,
  Option,
  Attachment,
  Field,
  Action,
  MarkdownTextObject,
  DividerBlock,
  ContextBlock
} from 'slack';
import { InitiativeResponse } from '../initiative';
import { STATUS_DISPLAY, INITIATIVE_INTENT_DISPLAY } from './display';
import { ActionType, InitiativeIntent } from '../interactions';
import { Status } from '../status';

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
    const name = new NameField(initiative);
    const status = new StatusField(initiative);
    const description = new DescriptionField(initiative);
    this.fields = [name, status, description];
    this.actions = Object.values(InitiativeIntent).map(intent => new InitiativeAction(initiative, intent));
    this.footer = `Created by ${initiative.createdBy} on ${initiative.createdAt}`;
    this.footer_icon = initiative.createdByIcon;
  }
}

export class InitiativeNameAndStatus implements SectionBlock {
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

class ActionButton implements Button {
  type: 'button' = 'button';
  text: PlainTextObject;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse, intent: InitiativeIntent) {
    this.action_id = intent;
    this.value = JSON.stringify({ initiative: initiative.initiativeId });
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
    const name = new NameField(initiative);
    const status = new StatusField(initiative);
    const description = new DescriptionField(initiative);
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

class DescriptionField implements Field {
  title: string;
  value: string;
  short: boolean;
  constructor(initiative: InitiativeResponse) {
    this.title = 'Description';
    this.value = initiative.description;
    this.short = false;
  }
}

class StatusField implements Field {
  title: string;
  value: string;
  short: boolean;
  constructor(initiative: InitiativeResponse) {
    this.title = 'Status';
    this.value = STATUS_DISPLAY[initiative.status].text;
    this.short = true;
  }
}

class NameField implements Field {
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
