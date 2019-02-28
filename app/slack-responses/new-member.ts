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
      text: `@here Hey ${initiative.name}, <@${
        member.slackUserId
      }> has joined your initiative as a *${member.role.toLowerCase()}*! :man-with-bunny-ears-partying::woman-with-bunny-ears-partying:
      If they aren't already here in the channel why don't you go ahead and invite them to join?`
    };
  }
}
