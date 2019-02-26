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
import { InitiativeResponse, Status } from '../initiative';
import { STATUS_DISPLAY, INITIATIVE_ACTION_DISPLAY } from './display';
import { InitiativeAction } from '../interactions';
import { stringifyValue } from './id-helper';

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

export class InitiativeNameStatusAndViewDetails implements Section {
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
    this.accessory = new ViewDetailsActionButton(initiative);
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

export class CreatedBy implements ContextBlock {
  type: 'context' = 'context';
  elements: (ImageContext | PlainText | MarkdownText)[];
  constructor(initiative: InitiativeResponse) {
    const createdByIcon: ImageContext = {
      type: 'image',
      image_url: initiative.createdBy.icon,
      alt_text: initiative.createdBy.name
    };
    const createdBy: MarkdownText = {
      type: 'mrkdwn',
      text: `Added by <@${initiative.createdBy.slackUserId}> on ${initiative.createdAt}`
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
    const joinAsMember = new JoinActionButton(initiative, false);
    const joinAsChampion = new JoinActionButton(initiative, true);
    this.elements = [joinAsMember, joinAsChampion];
  }
}

class ViewDetailsActionButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    const action = InitiativeAction.VIEW_DETAILS;
    this.action_id = action;
    this.value = stringifyValue({ initiativeId: initiative.initiativeId });
    this.text = {
      type: 'plain_text',
      text: INITIATIVE_ACTION_DISPLAY[action].text
    };
  }
}

class JoinActionButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse, champion: boolean) {
    const action = champion ? InitiativeAction.JOIN_AS_CHAMPION : InitiativeAction.JOIN_AS_MEMBER;
    this.action_id = action;
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, champion });
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
    this.placeholder = {
      type: 'plain_text',
      text: INITIATIVE_ACTION_DISPLAY[InitiativeAction.UPDATE_STATUS].text
    };
    this.options = Object.values(Status).map(status => new StatusOption(status, initiative));
    this.action_id = InitiativeAction.UPDATE_STATUS;
  }
}

class StatusOption implements Option {
  text: PlainText;
  value: string;
  constructor(status: Status, initiative: InitiativeResponse) {
    this.text = { text: STATUS_DISPLAY[status].text, type: 'plain_text' };
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, status });
  }
}
