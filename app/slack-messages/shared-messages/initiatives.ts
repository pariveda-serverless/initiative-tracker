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
import { Initiative } from '../../initiatives/';
import { InitiativeAction, stringifyValue } from '../../interactivity';

export class ReadOnlyInitiativeDetails implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(initiative: Initiative) {
    this.text = new FullInitiativeOverview(initiative);
  }
}

export class BasicInitiative implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory: Button;
  block_id: string;
  constructor(initiative: Initiative) {
    this.text = new BasicInitiativeOverview(initiative);
    this.accessory = new ViewDetailsButton(initiative);
  }
}

export class InitiativeDetails implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory: Overflow;
  constructor(initiative: Initiative) {
    this.text = new FullInitiativeOverview(initiative);
    this.accessory = new InitiativeActions(initiative);
  }
}

export class CreatedBy implements ContextBlock {
  type: 'context' = 'context';
  elements: (ImageContext | MarkdownText)[];
  constructor(initiative: Initiative) {
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

export class MetaInformation implements ContextBlock {
  type: 'context' = 'context';
  elements: MarkdownText[];
  constructor(initiative: Initiative) {
    let text: string;
    if (initiative.status && initiative.office) {
      text = `This *${initiative.statusDisplay}* initiative is part of the *${initiative.office}* office`;
    } else if (initiative.status) {
      text = `This initiative is *${initiative.statusDisplay}*`;
    } else if (initiative.office) {
      text = `This initiative is a part of the *${initiative.office}* office`;
    }
    this.elements = [{ type: 'mrkdwn', text }];
  }
}

export class InitiativeDetailActions implements Action {
  type: 'actions' = 'actions';
  elements: (StaticSelect | Button)[];
  constructor(initiative: Initiative) {
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
  constructor(initiative: Initiative) {
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
  constructor(initiative: Initiative) {
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
  constructor(initiative: Initiative) {
    this.action_id = InitiativeAction.JOIN_AS_MEMBER;
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, champion: false });
    this.text = { type: 'plain_text', text: 'Join initiative' };
  }
}

class InitiativeActions implements Overflow {
  type: 'overflow' = 'overflow';
  action_id: string;
  options: Option[];
  constructor(initiative: Initiative) {
    this.action_id = InitiativeAction.MODIFY_INITIATIVE;
    const edit = new EditOption(initiative);
    const add = new AddMemberOption(initiative);
    const remove = new RemoveOption(initiative);
    this.options = [edit, add, remove];
  }
}

class EditOption implements Option {
  text: PlainText;
  value: string;
  constructor(initiative: Initiative) {
    const action = InitiativeAction.OPEN_EDIT_DIALOG;
    this.text = { text: 'Edit initiative', type: 'plain_text' };
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, action });
  }
}

class AddMemberOption implements Option {
  text: PlainText;
  value: string;
  constructor(initiative: Initiative) {
    const action = InitiativeAction.OPEN_ADD_MEMBER_DIALOG;
    this.text = { text: 'Add member', type: 'plain_text' };
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, action });
  }
}

class RemoveOption implements Option {
  text: PlainText;
  value: string;
  constructor(initiative: Initiative) {
    const action = InitiativeAction.DELETE;
    this.text = { text: 'Remove initiative', type: 'plain_text' };
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, action });
  }
}

export class Divider implements DividerBlock {
  type: 'divider' = 'divider';
}

class FullInitiativeOverview implements MarkdownText {
  type: 'mrkdwn' = 'mrkdwn';
  text: string;
  constructor(initiative: Initiative) {
    const name = initiative.name ? `*${initiative.name}*` : '';
    const status = initiative.statusDisplay ? `(${initiative.statusDisplay})` : '';
    const office = initiative.office ? `*Office*: ${initiative.office}` : '';
    const channel = initiative.channel && initiative.channel.parsed ? `*Channel*: ${initiative.channel.parsed}` : '';
    const description = initiative.shortDescription ? `*Description*: ${initiative.shortDescription}` : '';

    const nameAndStatusLine = getSingleLineOrEmpty(name, status);
    const officeAndChannelLine = getSingleLineOrEmpty(office, channel);
    const descriptionLine = getSingleLineOrEmpty(description);
    this.text = nameAndStatusLine + officeAndChannelLine + descriptionLine;
  }
}

class BasicInitiativeOverview implements MarkdownText {
  type: 'mrkdwn' = 'mrkdwn';
  text: string;
  constructor(initiative: Initiative) {
    const name = initiative.name ? `*${initiative.name}*` : '';
    const description = initiative.shortDescription ? `\n${initiative.shortDescription}` : '';
    this.text = name + description;
  }
}

function getSingleLineOrEmpty(...fields): string {
  return fields.reduce((line, field) => {
    if (!line && !field) {
      return '';
    } else {
      return `${line ? line : '\n'}${field ? `${line ? `  ` : ''}${field}` : ''}`;
    }
  }, '');
}
