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
import { InitiativeResponse, Status, getStatusDisplay } from '../initiative';
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
      text: `*Status*\n${initiative.statusDisplay}`
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
      text: `*Status*\n${initiative.statusDisplay}`
    };
    this.fields = [name, status];
    this.accessory = new ViewDetailsButton(initiative);
  }
}

export class InitiativeNameStatusAndUpdateStatus implements Section {
  type: 'section' = 'section';
  fields: MarkdownText[];
  accessory: StaticSelect;
  constructor(initiative: InitiativeResponse) {
    const name: MarkdownText = {
      type: 'mrkdwn',
      text: `*Name*\n${initiative.name}`
    };
    const status: MarkdownText = {
      type: 'mrkdwn',
      text: `*Status*\n${initiative.statusDisplay}`
    };
    this.fields = [name, status];
    this.accessory = new StatusUpdate(initiative);
  }
}

export class InitiativeNameChannelAndUpdateStatus implements Section {
  type: 'section' = 'section';
  fields: MarkdownText[];
  accessory: StaticSelect;
  constructor(initiative: InitiativeResponse) {
    const name: MarkdownText = {
      type: 'mrkdwn',
      text: `*Name*\n${initiative.name}`
    };
    const channel: MarkdownText = {
      type: 'mrkdwn',
      text: `*Channel*\n${initiative.channel ? initiative.channel.parsed : ''}`
    };
    this.fields = [name, channel];
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
    const joinAsMember = new JoinAsMemberButton(initiative);
    const joinAsChampion = new JoinAsChampionButton(initiative);
    this.elements = [joinAsMember, joinAsChampion];
  }
}

class ViewDetailsButton implements Button {
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
      text: 'View details'
    };
  }
}

class JoinAsChampionButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = InitiativeAction.JOIN_AS_CHAMPION;
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, champion: true });
    this.text = {
      type: 'plain_text',
      text: 'Champion initiative'
    };
  }
}

class JoinAsMemberButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = InitiativeAction.JOIN_AS_MEMBER;
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, champion: false });
    this.text = {
      type: 'plain_text',
      text: 'Join initiative'
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
  initial_option: Option;
  constructor(initiative: InitiativeResponse) {
    this.placeholder = {
      type: 'plain_text',
      text: 'Update status'
    };
    this.options = Object.values(Status).map(status => new StatusOption(status, initiative));
    this.initial_option = new StatusOption(initiative.status, initiative);
    this.action_id = InitiativeAction.UPDATE_STATUS;
  }
}

class StatusOption implements Option {
  text: PlainText;
  value: string;
  constructor(status: Status, initiative: InitiativeResponse) {
    this.text = { text: getStatusDisplay(status), type: 'plain_text' };
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, status });
  }
}
