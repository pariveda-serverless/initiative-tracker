import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText } from 'slack';
import { Profile } from '../slack-api';

export class InvalidAddResponse implements Message {
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(text: string, profile: Profile) {
    const nameMissing = new NameMissing();
    this.blocks = [nameMissing];
  }
}

class NameMissing implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor() {
    const text = `Oh no, it looks like you forgot to name your initiative! :crying_cat_face:
    In addition to the name you can also add a description and channel to make it easier for people to learn more about the initiative and see if it's something they want to join
    */add-initiative [name], [optional description], [optional #channel]*`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}
