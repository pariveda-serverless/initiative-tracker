import { Attachment, OldMessage } from 'slack';
import { InitiativeResponse } from '../initiative';
import { BasicInitiativeCard } from './initiative-card';
import { Status } from '../status';
import { STATUS_DISPLAY } from './display';

export class ListResponse implements OldMessage {
  text: string;
  response_type: 'in_channel' | 'ephemeral';
  attachments: Attachment[];
  constructor(initiatives: InitiativeResponse[], status?: Status) {
    this.response_type = 'ephemeral';
    if (!initiatives || !initiatives.length) {
      const search = status ? `${STATUS_DISPLAY[status].text.toLowerCase()} ` : '';
      this.text = `No ${search}initiatives found `;
    }
    this.attachments = initiatives.map(initiative => new BasicInitiativeCard(initiative));
  }
}
