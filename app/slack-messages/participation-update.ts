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
import { InitiativeInformation, CreatedBy } from './shared-messages';
import { stringifyValue, MemberAction } from '../interactivity';
import { MemberResponse } from '../members';
import { Initiative } from '../initiatives';

export class ParticipationUpdateRequest implements Message {
  channel: string;
  text;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiative: Initiative, member: MemberResponse) {
    this.channel = member.slackUserId;
    const requestInfo = new RequestInfo(member);
    const nameAndStatus = new InitiativeInformation(initiative);
    const metaInformation = new CreatedBy(initiative);
    const participationActions = new UpdateParticipationActions(member, initiative);
    this.blocks = [requestInfo, nameAndStatus, metaInformation, participationActions];
  }
}

class RequestInfo implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(member: MemberResponse) {
    this.text = {
      type: 'mrkdwn',
      text: `Hey ${member.name.split(' ')[0]}, are you still participating in this initiative?`
    };
  }
}

class UpdateParticipationActions implements Action {
  type: 'actions' = 'actions';
  elements: (StaticSelect | Button)[];
  constructor(member: MemberResponse, initiative: Initiative) {
    const yes = new MarkParticipatingButton(member, initiative);
    const no = new MarkLeftButton(member, initiative);
    this.elements = [yes, no];
  }
}

class MarkParticipatingButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(member: MemberResponse, initiative: Initiative) {
    this.action_id = MemberAction.REMAIN_MEMBER;
    this.value = stringifyValue({
      initiativeId: initiative.initiativeId,
      slackUserId: member.slackUserId
    });
    this.text = { type: 'plain_text', text: 'Yes' };
  }
}

class MarkLeftButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id: string;
  value?: string;
  constructor(member: MemberResponse, initiative: Initiative) {
    this.action_id = MemberAction.REMOVE_MEMBER;
    this.value = stringifyValue({
      initiativeId: initiative.initiativeId,
      slackUserId: member.slackUserId
    });
    this.text = { type: 'plain_text', text: 'No' };
  }
}
