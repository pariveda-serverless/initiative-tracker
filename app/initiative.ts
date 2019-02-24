import * as id from 'nanoid';
import { MemberResponse, TEAM } from './member';

export enum Status {
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
  ABANDONED = 'ABANDONED',
  ON_HOLD = 'ON_HOLD'
}

export const INITIATIVE_TYPE: string = 'INITIATIVE';

export function getInitiativeIdentifiers(teamId: string): string {
  return `${TEAM}:${teamId}|${INITIATIVE_TYPE}`;
}

export interface InitiativeRecord {
  initiativeId: string;
  identifiers: string;
  [key: string]: any;
}

interface CreateInitiativeRequestProperties {
  name: string;
  team: {
    id: string;
    domain: string;
  };
  description?: string;
  createdBy: {
    slackUserId: string;
    name: string;
    icon: string;
  };
}

export class CreateInitiativeRequest {
  initiativeId: string;
  identifiers: string;
  type: string;
  team: {
    id: string;
    domain: string;
  };
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

  constructor({ name, team, description, createdBy }: CreateInitiativeRequestProperties) {
    this.initiativeId = id();
    this.identifiers = getInitiativeIdentifiers(team.id);
    this.type = INITIATIVE_TYPE;
    this.team = team;
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
  team: {
    id: string;
    domain: string;
  };
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
    this.team = record.team;
    this.createdAt = record.createdAt;
    this.createdBy = record.createdBy;
  }
}
