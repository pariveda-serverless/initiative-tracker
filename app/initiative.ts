import * as id from 'nanoid';
import { MemberResponse, TEAM } from './member';

export enum Status {
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
  ABANDONED = 'ABANDONED',
  ON_HOLD = 'ON_HOLD'
}

export const INITIATIVE_TYPE: string = 'INITIATIVE';

export interface InitiativeRecord {
  initiativeId: string;
  type: string;
  [key: string]: any;
}

interface CreateInitiativeRequestProperties {
  name: string;
  teamId: string;
  description?: string;
  createdBy: {
    slackUserId: string;
    name: string;
    icon: string;
  };
}

export class CreateInitiativeRequest {
  initiativeId: string;
  type: string;
  teamId: string;
  name: string;
  description: string;
  status: Status;
  createdBy: {
    slackUserId: string;
    name: string;
    icon: string;
  };
  createdBySlackUserId: string;
  createdAt: string;

  constructor({ name, teamId, description, createdBy }: CreateInitiativeRequestProperties) {
    this.initiativeId = id();
    this.type = `${TEAM}${teamId}${INITIATIVE_TYPE}`;
    this.teamId = teamId;
    this.name = name;
    this.description = description ? description : null;
    this.status = Status.ACTIVE;
    this.createdBy = createdBy;
    this.createdAt = new Date().toDateString();
  }
}

export class InitiativeResponse {
  initiativeId: string;
  name: string;
  description: string;
  status: Status;
  members?: MemberResponse[];
  createdBy: {
    slackUserId: string;
    name: string;
    icon: string;
  };
  createdAt: number;

  constructor(record: InitiativeRecord) {
    this.initiativeId = record.initiativeId;
    this.name = record.name;
    this.description = record.description;
    this.status = record.status;
    this.createdAt = record.createdAt;
    this.createdBy = record.createdBy;
  }
}
