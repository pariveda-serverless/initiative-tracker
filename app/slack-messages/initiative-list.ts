import { MarkdownText, Message, Section, DividerBlock, Action, ContextBlock } from 'slack';
import { InitiativeResponse, Status, getStatusDisplay } from '../initiatives';
import { InitiativeInformationAndViewDetails, CreatedBy, Divider } from './shared-messages';

export class ListResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiatives: InitiativeResponse[], status?: Status) {
    if (!initiatives || !initiatives.length) {
      this.blocks = [new NoResults(status)];
    } else {
      const initiativeSections = initiatives
        .map(initiative => {
          const nameAndStatus = new InitiativeInformationAndViewDetails(initiative);
          let blocks: (Section | DividerBlock | Action | ContextBlock)[] = [nameAndStatus];
          const metaInformation = new CreatedBy(initiative);
          const divider = new Divider();
          blocks = [...blocks, metaInformation, divider];
          return blocks;
        })
        .reduce((all, block) => all.concat(block), [])
        // Remove the last divider block
        .slice(0, -1);
      this.blocks = [new Results(status), ...initiativeSections];
    }
  }
}

class Results implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(status?: Status) {
    const search = status ? `*${getStatusDisplay(status).toLowerCase()}* ` : '';
    const text = `Here are all the ${search}initiatives we could find :bookmark_tabs: ... see one you want to join? :smiley:
    If you're not seeing anything you want to help with you should start a new initiative! :muscle:
    :tada: /add-initiative [name], [optional description], [optional #channel] :confetti_ball:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}

class NoResults implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(status?: Status) {
    const search = status ? `${getStatusDisplay(status).toLowerCase()} ` : '';
    const text = `Darn, we couldn't find any ${search}initiatives :thinking_face: ...  maybe you should add one! :muscle:
    :tada: /add-initiative [name], [optional description], [optional #channel] :confetti_ball:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}
