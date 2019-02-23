import { PlainText, MarkdownText, Message, Section, DividerBlock, Action, ContextBlock } from 'slack';
import { InitiativeResponse, Status } from '../initiative';
import { InitiativeNameStatusAndViewDetails, InitiativeDescription, CreatedBy, Divider } from './initiative-card';
import { STATUS_DISPLAY } from './display';

export class ListResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiatives: InitiativeResponse[], status?: Status) {
    this.channel = 'CFSV0HX5X';
    if (!initiatives || !initiatives.length) {
      this.blocks = [new NoResults(status)];
    } else {
      this.blocks = initiatives
        .map(initiative => {
          const nameAndStatus = new InitiativeNameStatusAndViewDetails(initiative);
          const description = new InitiativeDescription(initiative);
          const metaInformation = new CreatedBy(initiative);
          const divider = new Divider();
          return [nameAndStatus, description, metaInformation, divider];
        })
        .reduce((all, block) => all.concat(block), [])
        // Remove the last divider block
        .slice(0, -1);
    }
  }
}

class NoResults implements Section {
  type: 'section' = 'section';
  text: PlainText | MarkdownText;
  constructor(status?: Status) {
    const search = status ? `${STATUS_DISPLAY[status].text.toLowerCase()} ` : '';
    this.text = {
      type: 'mrkdwn',
      text: `Darn, we couldn't find any ${search}initiatives :thinking_face:... maybe you should add one! :muscle:`
    };
  }
}
