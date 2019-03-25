import { Message, Section, DividerBlock, Action, ContextBlock, MarkdownText, Button, PlainText } from 'slack';
import { InitiativeResponse } from '../initiatives';
import {
  Divider,
  CreatedBy,
  InitiativeDetailActions,
  InitiativeInformationAndUpdateActions,
  MemberSection
} from './shared-messages';
import { InitiativeAction, stringifyValue } from '../interactivity';

export class DetailResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor({ initiative, slackUserId, isPublic = false, queryId, channel }: DetailResponseProperties) {
    this.channel = channel;
    const divider = new Divider();

    let blocks: (Section | DividerBlock | Action | ContextBlock)[] = [];

    const header = new DetailsHeader(initiative);
    blocks.push(header);

    const nameAndStatus = new InitiativeInformationAndUpdateActions(initiative);
    blocks.push(nameAndStatus);

    const metaInformation = new CreatedBy(initiative);
    blocks.push(metaInformation);

    // Only add the join buttons if the user isn't already a member
    if (isPublic || !initiative.members.find(member => member.slackUserId === slackUserId)) {
      const initiativeActions = new InitiativeDetailActions(initiative);
      blocks.push(initiativeActions);
    }

    const members = initiative.members
      .sort(member => (member.champion ? -1 : 1))
      .map(member => {
        const memberSection = new MemberSection(member, initiative);
        return [memberSection, divider];
      })
      .reduce((all, block) => all.concat(block), [])
      // Remove the last divider block
      .slice(0, -1);

    const footer = new DetailsFooter(queryId);
    this.blocks = [...blocks, divider, ...members, footer];
  }
}

class DetailsHeader implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(initiative: InitiativeResponse) {
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
  constructor(queryId: string) {
    const text = `Want to view a list of all initiatives? :bookmark_tabs:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
    this.accessory = new ViewListButton(queryId);
  }
}

class ViewListButton implements Button {
  type: 'button' = 'button';
  text: PlainText;
  action_id = InitiativeAction.VIEW_LIST;
  value: string;
  constructor(queryId: string) {
    const text = `View all initiatives`.replace(/  +/g, '');
    this.text = { type: 'plain_text', text };
    this.value = stringifyValue({ queryId });
  }
}

interface DetailResponseProperties {
  initiative: InitiativeResponse;
  slackUserId: string;
  isPublic?: boolean;
  queryId?: string;
  channel?: string;
}
