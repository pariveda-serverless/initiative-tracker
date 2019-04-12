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
    const text = `Welcome to Initiative Tracker, ${getFirstName(
      user
    )} - here's some tips and tricks to help you get started!


    :female-teacher:
    To add a new initiative you can use the */add-initiative* command like this:
    */add-initiative [name], [optional description], [optional #channel]*


    :male-teacher:
    Want to see all of the initiatives? Use the */show-initiatives* command:
    */show-initiatives [optional filter: 'public'], [optional filter: 'active' | 'abandoned' | 'on hold' | 'complete']*
    
    :female_mage: :male_mage:
    From the list view you'll be able to filter further by status and office. You'll also be able to view an initiative's details including who the champions and members are and what Slack channel the group uses for communicating. You can also edit initiative information in case you made a mistake or something changes.

    
    That's all for now - best of luck and thanks for getting involved with internal initiatives!
    

    
    _Made with :black_heart: by Pariveda New York_
    `.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}

function getFirstName(user: User): string {
  if (user.name) {
    return user.name.indexOf(' ') >= 0 ? user.name.split(' ')[0] : user.name;
  } else {
    return '';
  }
}
