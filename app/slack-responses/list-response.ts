import { Attachment, Message } from 'slack';
import { InitiativeResponse } from '../initiative';
import { BasicInitiativeCard } from './initiative-card';

export class ListResponse implements Message {
  response_type: 'in_channel' | 'ephemeral';
  attachments: Attachment[];
  constructor(initiatives: InitiativeResponse[]) {
    this.response_type = 'ephemeral';
    this.attachments = initiatives.map(initiative => new BasicInitiativeCard(initiative));
  }
}
