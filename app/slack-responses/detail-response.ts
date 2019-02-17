import { Message, SectionBlock, DividerBlock, ActionsBlock, ContextBlock } from 'slack';
import { InitiativeResponse } from '../initiative';
import { DetailedInitiativeCard, DetailedInitiativeBlock } from './initiative-card';
import { MemberCard } from './member-card';

export class DetailResponse implements Message {
  channel: string;
  text: string;
  blocks: (SectionBlock | DividerBlock | ActionsBlock | ContextBlock)[];
  constructor(initiative: InitiativeResponse, slackUserId: string) {
    this.channel = slackUserId;
    // const initiativeCard = new DetailedInitiativeCard(initiative, slackUserId);
    // const members = initiative.members
    //   .sort(member => (member.champion ? -1 : 1))
    //   .map(member => new MemberCard(member, initiative));
    // this.attachments = [initiativeCard, ...members];
    const initiativeBlock = new DetailedInitiativeBlock(initiative);
    this.blocks = [initiativeBlock];
  }
}
