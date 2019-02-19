import { Section, Message, DividerBlock, Action, ContextBlock, PlainText, MarkdownText } from 'slack';

export class NotImplementedResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(channel: string) {
    this.channel = channel;
    const notImplementedSection = new NotImplementedSection();
    this.blocks = [notImplementedSection];
  }
}

class NotImplementedSection implements Section {
  type: 'section' = 'section';
  text: PlainText | MarkdownText;
  constructor() {
    this.text = {
      type: 'mrkdwn',
      text: `:sleep: Oh no, developers asleep on the job!  This command hasn't been implemented in the application yet or is improperly configured`
    };
  }
}
