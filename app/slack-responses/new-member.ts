import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText } from 'slack';
import { InitiativeResponse } from '../initiative';
import { MemberResponse } from '../member';

export class NewMemberNotification implements Message {
  channel: string;
  text;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiative: InitiativeResponse, member: MemberResponse) {
    this.channel = initiative.channel.id;
    this.blocks = [new NewMember(initiative, member)];
  }
}

class NewMember implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(initiative: InitiativeResponse, member: MemberResponse) {
    this.text = {
      type: 'mrkdwn',
      text: `Hey ${initiative.name}, ${member.name} has joined you as a ${member.role}!`
    };
  }
}
