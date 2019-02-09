import { Message, Attachment } from 'slack';
import { InitiativeResponse } from '../initiative';
import { BasicInitiativeCard } from './initiative-card';
import { MemberCard } from './member-card';

export class DetailResponse implements Message {
  response_type: 'in_channel' | 'ephemeral';
  attachments: Attachment[];
  constructor(initiative: InitiativeResponse) {
    this.response_type = 'ephemeral';
    const initiativeCard = new BasicInitiativeCard(initiative);
    const members = initiative.members.map(member => new MemberCard(member, initiative));
    this.attachments = [initiativeCard, ...members];
    // TODO add an attachment for initiative itself, wich intents being join and join (no view details)
  }
}
