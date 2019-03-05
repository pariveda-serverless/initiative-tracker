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
  ContextBlock,
  Overflow
} from 'slack';
import { InitiativeResponse } from '../initiative';
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

export class InitiativeNameChannelStatusAndUpdate implements Section {
  type: 'section' = 'section';
  fields: MarkdownText[];
  accessory: Overflow;
  constructor(initiative: InitiativeResponse) {
    const name: MarkdownText = {
      type: 'mrkdwn',
      text: `*Name*\n${initiative.name}`
    };
    const channel: MarkdownText = {
      type: 'mrkdwn',
      text: `*Channel*\n${initiative.channel ? initiative.channel.parsed : ''}`
    };
    const status: MarkdownText = {
      type: 'mrkdwn',
      text: `*Status*\n${initiative.statusDisplay}`
    };
    this.fields = [name, channel, status];
    // this.accessory = new EditInitiativeButton(initiative);
    this.accessory = new InitiativeActions(initiative);
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
  text: MarkdownText;
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

export class DeleteButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = InitiativeAction.DELETE;
    this.value = stringifyValue({ initiativeId: initiative.initiativeId });
    this.text = {
      type: 'plain_text',
      text: 'Delete'
    };
  }
}

export class ViewDetailsButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = InitiativeAction.VIEW_DETAILS;
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

class InitiativeActions implements Overflow {
  type: 'overflow' = 'overflow';
  action_id: string;
  options: Option[];
  constructor(initiative: InitiativeResponse) {
    this.action_id = InitiativeAction.UPDATE_INITIATIVE;
    const edit = new EditOption(initiative);
    const remove = new RemoveOption(initiative);
    this.options = [edit, remove];
  }
}

class EditOption implements Option {
  text: PlainText;
  value: string;
  constructor(initiative: InitiativeResponse) {
    const action = InitiativeAction.OPEN_EDIT_DIALOG;
    this.text = { text: 'Edit initiative', type: 'plain_text' };
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, action });
  }
}

class RemoveOption implements Option {
  text: PlainText;
  value: string;
  constructor(initiative: InitiativeResponse) {
    const action = InitiativeAction.DELETE;
    this.text = { text: 'Remove initiative', type: 'plain_text' };
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, action });
  }
}

class EditInitiativeButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = InitiativeAction.OPEN_EDIT_DIALOG;
    this.value = stringifyValue({ initiativeId: initiative.initiativeId });
    this.text = {
      type: 'plain_text',
      text: 'Edit initiative'
    };
  }
}

export class Divider implements DividerBlock {
  type: 'divider' = 'divider';
}
