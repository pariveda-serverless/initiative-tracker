import * as id from 'nanoid';
import { Status } from '../initiatives';

export class CreateQueryRequest {
  queryId: string;
  expiration: number;
  text: string;
  isPublic: boolean;
  status: Status;
  office: string;

  constructor({ queryId, text, status, office, isPublic }: QueryParams) {
    this.queryId = queryId ? queryId : id();
    this.expiration = getExpiration();
    if (text && !status && !isPublic) {
      ({ status, isPublic } = getQueryProperties(text));
    }
    this.text = text ? text : null;
    this.isPublic = isPublic;
    this.status = status;
    this.office = office;
  }

  getQuery(): Query {
    return new Query(this);
  }
}

export class Query {
  queryId: string;
  text: string;
  isPublic: boolean;
  status: Status;
  office: string;

  constructor(record: any) {
    this.queryId = record.queryId;
    this.text = record.text;
    this.isPublic = record.isPublic;
    this.status = record.status;
    this.office = record.office;
  }

  getUpdateRequest({ status, office, statusChanged, officeChanged }: QueryUpdateParams): CreateQueryRequest {
    console.log(`New status: ${status}, New office: ${office}`);
    console.log(`Status changed: ${statusChanged}, Office changed: ${officeChanged}`);
    if (statusChanged) {
      this.status = status;
    }
    if (officeChanged) {
      this.office = office;
    }
    return new CreateQueryRequest(this);
  }
}

interface QueryUpdateParams {
  status: Status;
  office: string;
  statusChanged: boolean;
  officeChanged: boolean;
}

interface QueryParams {
  queryId?: string;
  text?: string;
  status?: Status;
  office?: string;
  isPublic?: boolean;
}

function getQueryProperties(text: string): { status: Status; isPublic: boolean } {
  const statuses = text
    .split(',')
    .map(arg => getStatus(arg))
    .filter(status => status !== undefined);
  const isPublics = text
    .split(',')
    .map(arg => getIsPublic(arg))
    .filter(isPublic => isPublic !== undefined);
  const status = statuses && statuses.length > 0 && statuses[0];
  const isPublic = isPublics && isPublics.length > 0 && isPublics[0];
  return { status, isPublic };
}

function getStatus(arg: string): Status {
  const text = arg
    .toUpperCase()
    .trim()
    .replace(' ', '');
  const isStatus = Object.values(Status).includes(text);
  return isStatus ? Status[text] : undefined;
}

function getIsPublic(arg: string): boolean {
  const isPublic = arg.toUpperCase().trim() === 'PUBLIC';
  return isPublic || undefined;
}

function getExpiration(): number {
  const hoursToExpire = 96;
  const secondsInHour = 60 * 60;
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  return secondsSinceEpoch + hoursToExpire * secondsInHour;
}
