import { Message, SectionBlock, DividerBlock, ActionsBlock, ContextBlock } from 'slack';
import { InitiativeResponse } from '../initiative';
import {
  InitiativeNameAndStatus,
  InitiativeDescription,
  Divider,
  MetaInformation,
  InitiativeDetailActions
} from './initiative-card';
import { MemberSection } from './member-card';

export class DetailResponse implements Message {
  channel: string;
  blocks: (SectionBlock | DividerBlock | ActionsBlock | ContextBlock)[];
  constructor(initiative: InitiativeResponse, slackUserId: string) {
    this.channel = 'CFSV0HX5X';
    const nameAndStatus = new InitiativeNameAndStatus(initiative);
    const description = new InitiativeDescription(initiative);
    const metaInformation = new MetaInformation(initiative);
    const actions = new InitiativeDetailActions(initiative);
    const divider = new Divider();
    const members = initiative.members
      .sort(member => (member.champion ? -1 : 1))
      .map(member => new MemberSection(member, initiative));
    this.blocks = [nameAndStatus, description, metaInformation, actions, divider, ...members];
  }
}
