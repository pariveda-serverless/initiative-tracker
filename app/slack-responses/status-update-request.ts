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
import { InitiativeResponse } from '../initiative';
import { InitiativeNameAndStatus, InitiativeDescription, CreatedBy } from './initiative-card';
import { MemberResponse } from '../member';
import { StatusUpdateAction } from '../interactions';
import { STATUS_UPDATE_DISPLAY } from './display';

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
  text: PlainText | MarkdownText;
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
    this.elements = Object.values(StatusUpdateAction).map(action => new ActionButton(initiative, action));
  }
}

class ActionButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(initiative: InitiativeResponse, action: StatusUpdateAction) {
    this.action_id = action;
    this.value = JSON.stringify({
      initiativeId: initiative.initiativeId,
      status: STATUS_UPDATE_DISPLAY[action].status
    });
    this.text = {
      type: 'plain_text',
      text: STATUS_UPDATE_DISPLAY[action].text
    };
  }
}
