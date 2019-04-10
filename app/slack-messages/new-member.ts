import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText, Button } from 'slack';
import { ViewDetailsButton } from './shared-messages';
import { Initiative } from '../initiatives';
import { MemberResponse } from '../members';

export class NewMemberNotification implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiative: Initiative, member: MemberResponse) {
    this.channel = initiative.channel.id;
    const newMember = new NewMember(initiative, member);
    this.blocks = [newMember];
  }
}

class NewMember implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory: Button;
  constructor(initiative: Initiative, member: MemberResponse) {
    const text = `Hey ${initiative.name}, <@${
      member.slackUserId
    }> has joined as a *${member.role.toLowerCase()}*! :man-with-bunny-ears-partying::woman-with-bunny-ears-partying:
    If they aren't already <!here> in the channel why don't you go ahead and invite them to join?`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
    this.accessory = new ViewDetailsButton(initiative);
  }
}
