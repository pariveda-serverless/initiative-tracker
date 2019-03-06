import {
  Section,
  Message,
  DividerBlock,
  Action,
  ContextBlock,
  PlainText,
  MarkdownText,
  StaticSelect,
  Button
} from 'slack';
import { InitiativeResponse, Status } from '../initiative';
import { InitiativeNameAndStatus, InitiativeDescription, CreatedBy } from './initiatives';
import { MemberResponse } from '../member';
import { StatusUpdateAction } from '../interactions';
import { stringifyValue } from './id-helper';

export class StatusUpdateRequest implements Message {
  channel: string;
  text;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiative: InitiativeResponse, member: MemberResponse) {
    this.channel = member.slackUserId;
    const requestInfo = new RequestInfo(member);
    const nameAndStatus = new InitiativeNameAndStatus(initiative);
    const description = new InitiativeDescription(initiative);
    const metaInformation = new CreatedBy(initiative);
    const updateActions = new UpdateStatusActions(initiative);
    this.blocks = [requestInfo, nameAndStatus, description, metaInformation, updateActions];
  }
}

class RequestInfo implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(member: MemberResponse) {
    this.text = {
      type: 'mrkdwn',
      text: `Hey ${member.name.split(' ')[0]}, what's the status of this initiative?`
    };
  }
}

class UpdateStatusActions implements Action {
  type: 'actions' = 'actions';
  elements: (StaticSelect | Button)[];
  constructor(initiative: InitiativeResponse) {
    const active = new MarkActiveButton(initiative);
    const abandoned = new MarkAbandonedButton(initiative);
    const onHold = new MarkOnHoldButton(initiative);
    const complete = new MarkCompleteButton(initiative);
    this.elements = [active, abandoned, onHold, complete];
  }
}

class MarkActiveButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = StatusUpdateAction.MARK_ACTIVE;
    this.value = stringifyValue({
      initiativeId: initiative.initiativeId,
      status: Status.ACTIVE
    });
    this.text = { type: 'plain_text', text: 'Actively being worked on' };
  }
}

class MarkAbandonedButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = StatusUpdateAction.MARK_ABANDONED;
    this.value = stringifyValue({
      initiativeId: initiative.initiativeId,
      status: Status.ABANDONED
    });
    this.text = { type: 'plain_text', text: 'Not being worked on' };
  }
}

class MarkOnHoldButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = StatusUpdateAction.MARK_ON_HOLD;
    this.value = stringifyValue({
      initiativeId: initiative.initiativeId,
      status: Status.ON_HOLD
    });
    this.text = { type: 'plain_text', text: 'Temporarily on hold' };
  }
}

class MarkCompleteButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse) {
    this.action_id = StatusUpdateAction.MARK_COMPLETE;
    this.value = stringifyValue({
      initiativeId: initiative.initiativeId,
      status: Status.COMPLETE
    });
    this.text = { type: 'plain_text', text: 'Complete!' };
  }
}
