import { Section, Message, DividerBlock, Action, ContextBlock, PlainText, MarkdownText } from 'slack';

export class DeleteResponse implements Message {
  channel: string;
  blocks: Section[];
  constructor(channel: string, name: string) {
    this.channel = channel;
    this.blocks = [new DeletedSection(name)];
  }
}

class DeletedSection implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(name: string) {
    this.text = {
      type: 'mrkdwn',
      text: `:put_litter_in_its_place: Success!  ${name} has been deleted and all it's members removed.`
    };
  }
}
