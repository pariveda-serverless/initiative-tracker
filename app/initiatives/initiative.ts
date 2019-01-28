
// import { IsNotEmpty } from 'class-validator';
import { v4 } from 'uuid';

export class Initiative {
  constructor(body: any) {
    Object.keys(body).forEach(key => {
      if (body[key]) {
        this[key] = body[key];
      }
    });
    if (!body.id) {
      this.id = v4();
    }
  }

  creator: string

  name: string

  guid: string

  [key: string]: any;
}