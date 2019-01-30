
// import { IsNotEmpty } from 'class-validator';

interface IUser {
  slackId: string, 
  role: string
}

export class User {
  constructor(body: IUser) {
    this.slackId = body.slackId
    this.role = body.role
  }

  // @IsNotEmpty({ message: 'Submission ID is required' })
  slackId: string;

  role: string

}