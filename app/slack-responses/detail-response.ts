import { Message, Attachment } from 'slack';
import { InitiativeResponse } from '../initiative';
import { BasicInitiativeCard, DetailedInitiativeCard } from './initiative-card';
import { MemberCard } from './member-card';

export class DetailResponse implements Message {
  response_type: 'in_channel' | 'ephemeral';
  attachments: Attachment[];
  constructor(initiative: InitiativeResponse, slackUserId: string) {
    this.response_type = 'ephemeral';
    const initiativeCard = new DetailedInitiativeCard(initiative, slackUserId);
    const members = initiative.members
      .sort(member => (member.champion ? -1 : 1))
      .map(member => new MemberCard(member, initiative));
    this.attachments = [initiativeCard, ...members];
  }
}
