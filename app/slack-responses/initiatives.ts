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

export class InitiativeInformation implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(initiative: InitiativeResponse) {
    this.text = new InitiativeNameStatusAndChannel(initiative);
  }
}

export class InitiativeInformationAndViewDetails implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory?: ImageContext | Button | StaticSelect;
  constructor(initiative: InitiativeResponse) {
    this.text = new InitiativeNameStatusAndChannel(initiative);
    this.accessory = new ViewDetailsButton(initiative);
  }
}

export class InitiativeInformationAndUpdateActions implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory: Overflow;
  constructor(initiative: InitiativeResponse) {
    this.text = new InitiativeNameStatusAndChannel(initiative);
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
export class InitiativeDetailActions implements Action {
  type: 'actions' = 'actions';
  elements: (StaticSelect | Button)[];
  constructor(initiative: InitiativeResponse) {
    const joinAsMember = new JoinAsMemberButton(initiative);
    const joinAsChampion = new JoinAsChampionButton(initiative);
    this.elements = [joinAsMember, joinAsChampion];
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
    this.text = { type: 'plain_text', text: 'View details' };
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
    this.text = { type: 'plain_text', text: 'Champion initiative' };
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
    this.text = { type: 'plain_text', text: 'Join initiative' };
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

export class Divider implements DividerBlock {
  type: 'divider' = 'divider';
}

class InitiativeNameStatusAndChannel implements MarkdownText {
  type: 'mrkdwn' = 'mrkdwn';
  text: string;
  constructor(initiative: InitiativeResponse) {
    const name = initiative.name ? `*Name*: ${initiative.name}` : '';
    const status = initiative.statusDisplay ? `\n*Status*: ${initiative.statusDisplay}` : '';
    const channel = initiative.channel ? `\n*Channel*: ${initiative.channel ? initiative.channel.parsed : ''}` : '';
    const description = initiative.description ? `\n*Description*: ${initiative.description}` : '';
    this.text = name + status + channel + description;
  }
}
