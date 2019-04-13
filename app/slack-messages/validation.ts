import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText } from 'slack';
import { Profile } from '../slack-api';

export class InvalidAddResponse implements Message {
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(text: string, profile: Profile) {
    const nameMissing = new NameMissing(text);
    this.blocks = [nameMissing];
  }
}

class NameMissing implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(command: string) {
    const text = `Oh no, it looks like you forgot to name your initiative!
    You used the slash command */add-initiative ${command}*
    The correct command is */add-initiative [name], [optional description], [optional #channel]*`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}
