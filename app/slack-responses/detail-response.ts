import { Message, SectionBlock, DividerBlock, ActionsBlock, ContextBlock } from 'slack';
import { InitiativeResponse } from '../initiative';
import { InitiativeNameAndStatus, InitiativeDescription, Divider } from './initiative-card';
import { MemberCard } from './member-card';

export class DetailResponse implements Message {
  channel: string;
  blocks: (SectionBlock | DividerBlock | ActionsBlock | ContextBlock)[];
  constructor(initiative: InitiativeResponse, slackUserId: string) {
    this.channel = 'CFSV0HX5X';
    // const initiativeCard = new DetailedInitiativeCard(initiative, slackUserId);
    // const members = initiative.members
    //   .sort(member => (member.champion ? -1 : 1))
    //   .map(member => new MemberCard(member, initiative));
    // this.attachments = [initiativeCard, ...members];
    const nameAndStatus = new InitiativeNameAndStatus(initiative);
    const description = new InitiativeDescription(initiative);
    const divider = new Divider();
    this.blocks = [nameAndStatus, description, divider];
  }
}
