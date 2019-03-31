import * as id from 'nanoid';
import { Status } from '../initiatives';

export class CreateQueryRequest {
  queryId: string;
  identifiers: string;
  expiration: number;
  text: string;
  isPublic: boolean;
  status: Status;

  constructor(text: string) {
    const queryId = id();
    this.queryId = queryId;
    this.text = text;
    const { isPublic, status } = getQueryProperties(text);
    this.isPublic = isPublic;
    this.status = status;
    this.expiration = getExpiration();
  }
}

export class Query {
  queryId: string;
  text: string;
  isPublic: boolean;
  status: Status;

  constructor(record: any) {
    this.queryId = record.queryId;
    this.text = record.text;
    this.isPublic = record.isPublic;
    this.status = record.status;
  }
}

function getExpiration(): number {
  const hoursToExpire = 96;
  const secondsInHour = 60 * 60;
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  return secondsSinceEpoch + hoursToExpire * secondsInHour;
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
