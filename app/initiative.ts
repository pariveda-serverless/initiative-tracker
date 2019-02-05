import { v4 } from 'uuid';
import { Status } from './status';

export const INITIATIVE_TYPE: string = 'INITIATIVE';
export const MEMBER_TYPE: string = 'MEMBER:';

export interface InitiativeRecord {
  initiativeId: string;
  type: string;
  [key: string]: any;
}

export class CreateMemberRequest {
  initiativeId: string;
  type: string;
  name: string;
  slackUserId: string;
  champion: boolean;

  constructor({ initiativeId, name, slackUserId, champion = false }: CreateMemberRequestProperties) {
    this.initiativeId = initiativeId;
    this.type = `${MEMBER_TYPE}${slackUserId}`;
    this.name = name;
    this.slackUserId = slackUserId;
    this.champion = champion;
  }
}

interface CreateMemberRequestProperties {
  initiativeId: string;
  name: string;
  slackUserId: string;
  champion: boolean;
}

interface CreateInitiativeRequestProperties {
  name: string;
}

export class CreateInitiativeRequest {
  initiativeId: string;
  type: string;
  name: string;
  status: Status;

  constructor({ name }: CreateInitiativeRequestProperties) {
    this.initiativeId = v4();
    this.name = name;
    this.type = `${INITIATIVE_TYPE}`;
    this.status = Status.IN_PROGRESS;
  }
}

export class InitiativeResponse {
  initiativeId: string;
  name: string;
  status: Status;

  constructor(record: InitiativeRecord) {
    this.initiativeId = record.initiativeId;
    this.name = record.name;
    this.status = record.status;
  }
}
