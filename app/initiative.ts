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
  channel?: string;
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
  channel: string;
  status: Status;
  createdBy: {
    slackUserId: string;
    name: string;
    icon: string;
  };
  createdBySlackUserId: string;
  createdAt: string;

  constructor({ name, team, description, channel, createdBy }: CreateInitiativeRequestProperties) {
    this.initiativeId = id();
    this.identifiers = getInitiativeIdentifiers(team.id);
    this.type = INITIATIVE_TYPE;
    this.team = team;
    this.name = name;
    this.description = description ? description.trim() : null;
    this.channel = channel ? channel.trim() : null;
    this.status = Status.ACTIVE;
    this.createdBy = createdBy;
    this.createdAt = new Date().toDateString();
  }
}

export class InitiativeResponse {
  initiativeId: string;
  name: string;
  description: string;
  channel: string;
  status: Status;
  statusDisplay: string;
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
    this.channel = record.channel;
    this.status = record.status;
    this.statusDisplay = getStatusDisplay(record.status);
    this.team = record.team;
    this.createdAt = record.createdAt;
    this.createdBy = record.createdBy;
  }
}

export function getStatusDisplay(status: Status): string {
  const display = status.toLowerCase().replace('_', ' ');
  return display.charAt(0).toUpperCase() + display.slice(1);
}
