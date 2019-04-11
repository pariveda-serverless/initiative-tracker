import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText } from 'slack';
import { User } from '../users';

export class WelcomeMessage implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(user: User) {
    this.channel = user.slackUserId;
    const welcome = new Welcome(user);
    this.blocks = [welcome];
  }
}

class Welcome implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(user: User) {
    const text = `Welcome, ${user.name}`;
    this.text = { type: 'mrkdwn', text };
  }
}
