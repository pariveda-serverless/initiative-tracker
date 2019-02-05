import { Status } from './status';

import { v4 } from 'uuid';
import { timingSafeEqual } from 'crypto';

interface IInitiative {
  creator: string;
  name: string;
  id: string;
  status: string;
}

interface ITableInitiative {
  partitionKey: string;
  sortKey: string;
  creator: string;
  name: string;
  status: string;
}

export interface CreateInitiativeProperties {
  name: string;
  creator: string;
  status: Status;
}

export class CreateInitiativeRequest {
  constructor({ name, creator, status }: CreateInitiativeProperties) {}
}

export class InitiativeRecord {
  initiativeId;
  sortKey;
  name;

  consuctor(dynamoRecord) {}
}

export class Initiative {
  // constructor();
  // constructor(initiative: ITableInitiative)
  constructor({ name, creator, status }: InitiativeProperties) {
    this.name = name;
    this.creator = creator;
    this.status = status;
    if (body.partitionKey) {
      // it is a ITableInitiative
      Object.keys(body).forEach(key => {
        if (body[key]) {
          this[key] = body[key];
        }
      });
      this.id = body.partitionKey.replace('INITIATIVE:', '');
      delete this.partitionKey;
      delete this.sortKey;
    } else {
      // it is an object
      Object.keys(body).forEach(key => {
        if (body[key]) {
          this[key] = body[key];
        }
      });
      if (!body.id) {
        this.id = v4();
      }
    }
  }

  creator: string;

  name: string;

  id: string;

  status: string;

  [key: string]: any;
}
