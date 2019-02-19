import { Message, SectionBlock, DividerBlock, ActionsBlock, ContextBlock } from 'slack';
import { InitiativeResponse } from '../initiative';
import {
  InitiativeNameStatusAndUpdateStatus,
  InitiativeDescription,
  Divider,
  MetaInformation,
  InitiativeDetailActions
} from './initiative-card';
import { NameAndRole, MemberActions } from './member-card';

export class DetailResponse implements Message {
  channel: string;
  blocks: (SectionBlock | DividerBlock | ActionsBlock | ContextBlock)[];
  constructor(initiative: InitiativeResponse, channel?: string) {
    this.channel = channel;
    const nameAndStatus = new InitiativeNameStatusAndUpdateStatus(initiative);
    const description = new InitiativeDescription(initiative);
    const metaInformation = new MetaInformation(initiative);
    const initiativeActions = new InitiativeDetailActions(initiative);
    const divider = new Divider();
    const members = initiative.members
      .sort(member => (member.champion ? -1 : 1))
      .map(member => {
        const nameAndRole = new NameAndRole(member, initiative);
        const memberActions = new MemberActions(member, initiative);
        return [nameAndRole, memberActions, divider];
      })
      .reduce((all, block) => all.concat(block), []);
    this.blocks = [nameAndStatus, description, metaInformation, initiativeActions, divider, ...members];
  }
}
