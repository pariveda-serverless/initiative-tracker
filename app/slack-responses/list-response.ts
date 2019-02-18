import {
  PlainTextObject,
  MarkdownTextObject,
  Message,
  SectionBlock,
  DividerBlock,
  ActionsBlock,
  ContextBlock
} from 'slack';
import { InitiativeResponse } from '../initiative';
import {
  InitiativeNameAndStatus,
  InitiativeDescription,
  MetaInformation,
  Divider,
  InitiativeListActions
} from './initiative-card';
import { Status } from '../status';
import { STATUS_DISPLAY } from './display';

export class ListResponse implements Message {
  channel: string;
  text?: PlainTextObject | MarkdownTextObject;
  blocks: (SectionBlock | DividerBlock | ActionsBlock | ContextBlock)[];
  constructor(initiatives: InitiativeResponse[], status?: Status) {
    this.channel = 'CFSV0HX5X';
    if (!initiatives || !initiatives.length) {
      const search = status ? `${STATUS_DISPLAY[status].text.toLowerCase()} ` : '';
      this.text = { type: 'mrkdwn', text: `No ${search}initiatives found ` };
    }

    const list = initiatives.map(initiative => {
      const nameAndStatus = new InitiativeNameAndStatus(initiative);
      const description = new InitiativeDescription(initiative);
      const metaInformation = new MetaInformation(initiative);
      const actions = new InitiativeListActions(initiative);
      const divider = new Divider();
      return [nameAndStatus, description, metaInformation, actions, divider];
    });

    this.blocks = list.reduce((acc, val) => acc.concat(val), []);
  }
}
