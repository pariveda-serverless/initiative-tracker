import { v4 } from 'uuid';
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
    this.status = Status.ACTIVE;
  }
}

export class InitiativeResponse {
  initiativeId: string;
  name: string;
  status: Status;
  members?: MemberResponse[];

  constructor(record: InitiativeRecord) {
    this.initiativeId = record.initiativeId;
    this.name = record.name;
    this.status = record.status;
  }
}
