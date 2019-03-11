import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText, Button } from 'slack';

export class RemainMemberResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(channel: string) {
    this.channel = channel;
    this.blocks = [new Remain()];
  }
}

class Remain implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory: Button;
  constructor() {
    this.text = { type: 'mrkdwn', text: 'Thank you so much for helping us out with this initiative!' };
  }
}
