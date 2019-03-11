import { PlainText, MarkdownText, Message, Section, DividerBlock, Action, ContextBlock } from 'slack';
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
    const text = `Here are all the ${search}initiatives we could find :telescope: ...  see one you want to join? :thinking_face:
    To add a new initiative use the /add-initiative [name], [optional description], [optional #channel] slash command`.replace(
      /  +/g,
      ''
    );
    this.text = { type: 'mrkdwn', text };
  }
}

class NoResults implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(status?: Status) {
    const search = status ? `${getStatusDisplay(status).toLowerCase()} ` : '';
    this.text = {
      type: 'mrkdwn',
      text: `Darn, we couldn't find any ${search}initiatives :thinking_face: ...  maybe you should add one! :muscle:`
    };
  }
}
