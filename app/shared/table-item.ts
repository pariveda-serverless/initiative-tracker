
// import { IsNotEmpty } from 'class-validator';
import { v4 } from 'uuid';

export class TableItem {
constructor({body, partitionKey, sortKey}: {body: any, partitionKey: string, sortKey?: string} ) {
    this.partitionKey = partitionKey;
    this.sortKey = sortKey || this.partitionKey;
    Object.keys(body).forEach(key => {
      if (body[key]) {
        this[key] = body[key];
      }
    });
  }

  // @IsNotEmpty({ message: 'Submission ID is required' })
  partitionKey: string;

  [key: string]: any;
}