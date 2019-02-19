import {
  SectionBlock,
  Message,
  DividerBlock,
  ActionsBlock,
  ContextBlock,
  PlainTextObject,
  MarkdownTextObject
} from 'slack';

export class NotImplementedResponse implements Message {
  channel: string;
  blocks: (SectionBlock | DividerBlock | ActionsBlock | ContextBlock)[];
  constructor(channel: string) {
    this.channel = channel;
    const notImplementedSection = new NotImplementedSection();
    this.blocks = [notImplementedSection];
  }
}

class NotImplementedSection implements SectionBlock {
  type: 'section' = 'section';
  text: PlainTextObject | MarkdownTextObject;
  constructor() {
    this.text = {
      type: 'mrkdwn',
      text: `:sleep: Oh no, developers asleep on the job!  This command hasn't been implemented in the application yet or is improperly configured`
    };
  }
}
