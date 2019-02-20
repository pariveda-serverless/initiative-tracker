import * as id from 'nanoid';
import { Status } from './status';
import { MemberResponse } from './member';

export const INITIATIVE_TYPE: string = 'INITIATIVE';

export interface InitiativeRecord {
  initiativeId: string;
  type: string;
  [key: string]: any;
}

interface CreateInitiativeRequestProperties {
  name: string;
  description?: string;
  createdBy: string;
  createdByIcon: string;
}

export class CreateInitiativeRequest {
  initiativeId: string;
  type: string;
  name: string;
  description: string;
  status: Status;
  createdBy: string;
  createdByIcon: string;
  createdAt: string;

  constructor({ name, description, createdBy, createdByIcon }: CreateInitiativeRequestProperties) {
    this.initiativeId = id();
    this.name = name;
    this.description = description ? description : null;
    this.type = `${INITIATIVE_TYPE}`;
    this.status = Status.ACTIVE;
    this.createdBy = createdBy;
    this.createdByIcon = createdByIcon;
    this.createdAt = new Date().toDateString();
  }
}

export class InitiativeResponse {
  initiativeId: string;
  name: string;
  description: string;
  status: Status;
  members?: MemberResponse[];
  createdBy: string;
  createdByIcon: string;
  createdAt: number;

  constructor(record: InitiativeRecord) {
    this.initiativeId = record.initiativeId;
    this.name = record.name;
    this.description = record.description;
    this.status = record.status;
    this.createdAt = record.createdAt;
    this.createdBy = record.createdBy;
    this.createdByIcon = record.createdByIcon;
  }
}
