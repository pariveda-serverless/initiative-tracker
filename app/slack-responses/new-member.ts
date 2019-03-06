import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText, Button } from 'slack';
import { InitiativeResponse } from '../initiative';
import { MemberResponse } from '../member';
import { ViewDetailsButton } from './initiatives';

export class NewMemberNotification implements Message {
  channel: string;
  text;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiative: InitiativeResponse, member: MemberResponse) {
    this.channel = initiative.channel.id;
    const newMember = new NewMember(initiative, member);
    this.blocks = [newMember];
  }
}

class NewMember implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory: Button;
  constructor(initiative: InitiativeResponse, member: MemberResponse) {
    const text = `Hey ${initiative.name}, <@${
      member.slackUserId
    }> has joined as a *${member.role.toLowerCase()}*! :man-with-bunny-ears-partying::woman-with-bunny-ears-partying:
    If they aren't already <!here> in the channel why don't you go ahead and invite them to join?`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
    this.accessory = new ViewDetailsButton(initiative);
  }
}
