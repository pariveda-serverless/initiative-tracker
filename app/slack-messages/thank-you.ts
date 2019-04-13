import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText, Button } from 'slack';

export class ThankYouResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(channel: string) {
    this.channel = channel;
    this.blocks = [new ThankYou()];
  }
}

class ThankYou implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory: Button;
  constructor(initiativeName?: string) {
    this.text = {
      type: 'mrkdwn',
      text: `:100: Thank you so much for helping out with ${
        initiativeName ? `the ${initiativeName}` : 'this'
      } initiative!`
    };
  }
}
