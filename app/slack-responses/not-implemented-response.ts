import { Message, Attachment } from 'slack';
import { YELLOW } from './display';

export class NotImplementedResponse implements Message {
  response_type: 'in_channel' | 'ephemeral';
  attachments: Attachment[];
  constructor() {
    this.response_type = 'ephemeral';
    this.attachments = [new NotImplementedCard()];
  }
}

class NotImplementedCard implements Attachment {
  color: string;
  attachment_type: string;
  footer_icon: string;
  footer: string;
  title: string;
  ts: number;

  constructor() {
    this.color = YELLOW;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.footer_icon =
      'https://user-images.githubusercontent.com/2955468/52139934-6e6d2880-261f-11e9-9bbf-cfacd1facf3a.png';
    this.footer = 'Initiative Tracker';
    this.title = `Woops!  This command hasn't been implemented in the application yet or is improperly configured`;
    this.ts = new Date().getTime() / 1000;
  }
}
