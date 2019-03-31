import * as id from 'nanoid';

export class CreateQueryRequest {
  queryId: string;
  identifiers: string;
  expiration: number;
  type: string;
  query: string;

  constructor(query: string) {
    const queryId = id();
    this.queryId = queryId;
    this.query = query;
    this.expiration = getExpiration();
  }
}

function getExpiration(): number {
  const hoursToExpire = 96;
  const secondsInHour = 60 * 60;
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  return secondsSinceEpoch + hoursToExpire * secondsInHour;
}

export class Query {
  queryId: string;
  query: string;

  constructor(record: any) {
    this.queryId = record.queryId;
    this.query = record.query;
  }
}
