
import { v4 } from 'uuid';
import { timingSafeEqual } from 'crypto';

interface IInitiative {    
  creator : string;
  name : string;
  id : string;
  status: string;
}

interface ITableInitiative {
  partitionKey: string;
  sortKey: string;
  creator : string;
  name : string;
  status: string;
}

export class Initiative {

  // constructor();
  // constructor(initiative: ITableInitiative)
  constructor(body: any) {
    if (body.partitionKey) { // it is a ITableInitiative
      Object.keys(body).forEach(key => {
        if (body[key]) {
          this[key] = body[key];
        }
      });
      this.id = body.partitionKey.replace('INITIATIVE:','')
      delete this.partitionKey;
      delete this.sortKey
    } else { // it is an object
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

  creator: string

  name: string

  id: string

  status: string;

  [key: string]: any;
}