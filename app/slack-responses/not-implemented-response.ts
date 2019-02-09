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
  image_url: string;
  title: string;

  constructor() {
    this.color = YELLOW;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.image_url =
      'https://user-images.githubusercontent.com/2955468/52139934-6e6d2880-261f-11e9-9bbf-cfacd1facf3a.png';
    this.title = `Woops!  This command hasn't been implemented in the application yet or is improperly configured`;
  }
}
