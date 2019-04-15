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
import { Initiative, Status } from '../../initiatives/';
import { InitiativeAction, stringifyValue } from '../../interactivity';

export class ReadOnlyInitiativeDetails implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(initiative: Initiative) {
    this.text = new DetailedInitiativeOverview(initiative);
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
    this.text = new DetailedInitiativeOverview(initiative);
    this.accessory = new InitiativeActions(initiative);
  }
}

class CreatedByIcon implements ImageContext {
  type: 'image' = 'image';
  image_url: string;
  alt_text: string;
  constructor(initiative: Initiative) {
    this.image_url = initiative.createdBy.icon;
    this.alt_text = initiative.createdBy.name;
  }
}

export class MetaInformation implements ContextBlock {
  type: 'context' = 'context';
  elements: (ImageContext | MarkdownText)[];
  constructor(initiative: Initiative) {
    const status = initiative.status ? ` *${initiative.statusDisplay.toLowerCase()}*` : '';
    const office = initiative.office ? ` in *${initiative.office}*` : '';
    const createdBy = `was added by <@${initiative.createdBy.slackUserId}>`;
    const channel = initiative.channel && initiative.channel.parsed ? ` - more @ ${initiative.channel.parsed}` : '';
    const text = `This${status} initiative${office} ${createdBy}${channel}`;
    this.elements = [new CreatedByIcon(initiative), { type: 'mrkdwn', text }];
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
    this.text = { type: 'plain_text', text: 'Details' };
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

class BasicInitiativeOverview implements MarkdownText {
  type: 'mrkdwn' = 'mrkdwn';
  text: string;
  constructor(initiative: Initiative) {
    const name = initiative.name ? `*${initiative.name}*` : '';
    const description = initiative.shortDescription ? `\n_${initiative.shortDescription}_` : '';
    this.text = name + description;
  }
}

class DetailedInitiativeOverview implements MarkdownText {
  type: 'mrkdwn' = 'mrkdwn';
  text: string;
  constructor(initiative: Initiative) {
    const name = initiative.name ? `*${initiative.name}*` : '';
    const description = initiative.description ? `\n_${initiative.description}_` : '';
    this.text = name + description;
  }
}

function getIndefiniteArticleForStatus(status: Status): 'a' | 'an' {
  switch (status) {
    case Status.ABANDONED:
    case Status.ACTIVE:
    case Status.ON_HOLD: {
      return 'an';
    }
    case Status.COMPLETE: {
      return 'a';
    }
  }
}
