import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText, Button, PlainText } from 'slack';
import { Initiative } from '../initiatives';
import { Divider, CreatedBy, InitiativeDetailActions, InitiativeDetails, MemberSection } from './shared-messages';
import { InitiativeAction } from '../interactivity';

export class DetailResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor({ initiative, slackUserId, isPublic, channel }: DetailResponseProperties) {
    this.channel = channel;

    let blocks: (Section | DividerBlock | Action | ContextBlock)[] = [];

    const header = new DetailsHeader(initiative);
    blocks.push(header);

    const nameAndStatus = new InitiativeDetails(initiative);
    blocks.push(nameAndStatus);

    const createdBy = new CreatedBy(initiative);
    blocks.push(createdBy);

    // Only add the join buttons if the user isn't already a member
    if (isPublic || !initiative.members.find(member => member.slackUserId === slackUserId)) {
      const initiativeActions = new InitiativeDetailActions(initiative);
      blocks.push(initiativeActions);
    }

    const members = initiative.members
      .sort(member => (member.champion ? -1 : 1))
      .map(member => {
        const memberSection = new MemberSection(member, initiative);
        return [memberSection, new Divider()];
      })
      .reduce((all, block) => all.concat(block), []);

    const footer = new DetailsFooter();
    this.blocks = [...blocks, new Divider(), ...members, footer];
  }
}

class DetailsHeader implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  block_id: string;
  constructor(initiative: Initiative) {
    const text = `Here are the details for the ${
      initiative.name
    } initiative - if it looks interesting you should join! :muscle:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}

class DetailsFooter implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  accessory: Button;
  constructor() {
    const text = `Click here to go back to the initiative search results :point_right:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
    this.accessory = new ViewListButton();
  }
}

class ViewListButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id = InitiativeAction.VIEW_LIST;
  constructor() {
    const text = `View all initiatives`.replace(/  +/g, '');
    this.text = { type: 'plain_text', text };
  }
}

interface DetailResponseProperties {
  initiative: Initiative;
  slackUserId: string;
  isPublic?: boolean;
  channel?: string;
}
