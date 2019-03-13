import { Section, Message, MarkdownText } from 'slack';

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
      text: `:put_litter_in_its_place: Success!  ${name.charAt(0).toUpperCase() +
        name.slice(1)} has been deleted and all its members removed.`
    };
  }
}
