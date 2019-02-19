import {
  Section,
  StaticSelect,
  ImageContext,
  Button,
  Action,
  PlainText,
  Option,
  MarkdownText,
  DividerBlock,
  ContextBlock
} from 'slack';
import { InitiativeResponse } from '../initiative';
import { STATUS_DISPLAY, INITIATIVE_ACTION_DISPLAY } from './display';
import { InitiativeListAction, InitiativeDetailAction } from '../interactions';
import { Status } from '../status';

export class InitiativeNameAndStatus implements Section {
  type: 'section' = 'section';
  fields?: (PlainText | MarkdownText)[];
  constructor(initiative: InitiativeResponse) {
    const name: MarkdownText = {
      type: 'mrkdwn',
      text: `*Name*\n${initiative.name}`
    };
    const status: MarkdownText = {
      type: 'mrkdwn',
      text: `*Status*\n${STATUS_DISPLAY[initiative.status].text}`
    };
    this.fields = [name, status];
  }
}

export class InitiativeNameStatusAndUpdateStatus implements Section {
  type: 'section' = 'section';
  fields?: (PlainText | MarkdownText)[];
  accessory?: ImageContext | Button | StaticSelect;
  constructor(initiative: InitiativeResponse) {
    const name: MarkdownText = {
      type: 'mrkdwn',
      text: `*Name*\n${initiative.name}`
    };
    const status: MarkdownText = {
      type: 'mrkdwn',
      text: `*Status*\n${STATUS_DISPLAY[initiative.status].text}`
    };
    this.fields = [name, status];
    this.accessory = new StatusUpdate(initiative);
  }
}

export class MetaInformation implements ContextBlock {
  type: 'context' = 'context';
  elements: (ImageContext | PlainText | MarkdownText)[];
  constructor(initiative: InitiativeResponse) {
    const createdByIcon: ImageContext = {
      type: 'image',
      image_url: initiative.createdByIcon,
      alt_text: 'img'
    };
    const createdBy: MarkdownText = {
      type: 'mrkdwn',
      text: `Created by ${initiative.createdBy} on ${initiative.createdAt}`
    };
    this.elements = [createdByIcon, createdBy];
  }
}

export class InitiativeDescription implements Section {
  type: 'section' = 'section';
  text: PlainText | MarkdownText;
  constructor(initiative: InitiativeResponse) {
    this.text = {
      type: 'mrkdwn',
      text: `*Description*\n${initiative.description}`
    };
  }
}

export class InitiativeDetailActions implements Action {
  type: 'actions' = 'actions';
  elements: (StaticSelect | Button)[];
  constructor(initiative: InitiativeResponse) {
    this.elements = Object.values(InitiativeDetailAction).map(action => new ActionButton(initiative, action));
  }
}

export class InitiativeListActions implements Action {
  type: 'actions' = 'actions';
  elements: (StaticSelect | Button)[];
  constructor(initiative: InitiativeResponse) {
    this.elements = Object.values(InitiativeListAction).map(action => new ActionButton(initiative, action));
  }
}

class ActionButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse, action: InitiativeDetailAction | InitiativeListAction) {
    this.action_id = action;
    this.value = JSON.stringify({ initiativeId: initiative.initiativeId });
    this.text = {
      type: 'plain_text',
      text: INITIATIVE_ACTION_DISPLAY[action].text
    };
  }
}

export class Divider implements DividerBlock {
  type: 'divider' = 'divider';
}

export class StatusUpdate implements StaticSelect {
  type: 'static_select' = 'static_select';
  placeholder: PlainText;
  action_id: string;
  options: Option[];
  constructor(initiative: InitiativeResponse) {
    this.placeholder = { type: 'plain_text', text: 'Update status' };
    this.options = Object.values(Status).map(status => new StatusOption(status, initiative));
    this.action_id = InitiativeDetailAction.UPDATE_STATUS;
  }
}

class StatusOption implements Option {
  text: PlainText;
  value: string;
  constructor(status: Status, initiative: InitiativeResponse) {
    this.text = { text: STATUS_DISPLAY[status].text, type: 'plain_text' };
    this.value = JSON.stringify({ initiativeId: initiative.initiativeId, status });
  }
}
