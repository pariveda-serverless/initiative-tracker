
// import { IsNotEmpty } from 'class-validator';
import { v4 } from 'uuid';

export class User {
  constructor(body: any) {
    Object.keys(body).forEach(key => {
      if (body[key]) {
        this[key] = body[key];
      }
    });
    if (!this.id) {
      this.id = v4();
    }
  }

  // @IsNotEmpty({ message: 'Submission ID is required' })
  id: string;

  [key: string]: any;
}