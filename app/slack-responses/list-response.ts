import { PlainText, MarkdownText, Message, Section, DividerBlock, Action, ContextBlock } from 'slack';
import { InitiativeResponse } from '../initiative';
import { InitiativeNameStatusAndViewDetails, InitiativeDescription, CreatedBy, Divider } from './initiative-card';
import { Status } from '../status';
import { STATUS_DISPLAY } from './display';

export class ListResponse implements Message {
  channel: string;
  text?: PlainText | MarkdownText;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiatives: InitiativeResponse[], status?: Status) {
    this.channel = 'CFSV0HX5X';
    if (!initiatives || !initiatives.length) {
      const search = status ? `${STATUS_DISPLAY[status].text.toLowerCase()} ` : '';
      this.text = { type: 'mrkdwn', text: `No ${search}initiatives found ` };
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
