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
    const text = `Welcome to Initiative Tracker, ${user.name}!
    Here's some tips and tricks to help you get started :female-teacher:

    To add a new initiative you can use the */add-initiative* command like this:
    */add-initiative [name], [optional description], [optional #channel]* :ok_hand:

    Want to see all of the initiatives?  Use the */show-initiatives* command
    */show-initiatives [optional filter: 'public'], [optional filter: 'active' | 'abandoned' | 'on hold' | 'complete']*
    From the list view you'll be able to filter further by status and office

    From the list you can view the details of an initiative including who the champions and members are and what Slack channel the group uses for communicating.  You'll also be able to edit initiative information in case you made a mistake or something changes.

    That's all for now - best of luck and thanks for getting involved with internal initiatives!
    
    
    Made with :black_heart: by Pariveda New York :city_sunset:
    `.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}
