
// import { IsNotEmpty } from 'class-validator';
import { v4 } from 'uuid';

export class Initiative {
  constructor(body: any) {
    Object.keys(body).forEach(key => {
      if (body[key]) {
        this[key] = body[key];
      }
    });
    if (!this.initiativeId) {
      this.initiativeId = v4();
    }
  }

  // @IsNotEmpty({ message: 'Submission ID is required' })
  initiativeId: string;

  [key: string]: any;
}