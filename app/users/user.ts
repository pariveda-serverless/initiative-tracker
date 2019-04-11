export class CreateUserRequest {
  slackUserId: string;
  name: string;
  icon: string;
  office?: string;
  constructor({ slackUserId, name, icon, office }: CreateUserRequestParams) {
    this.slackUserId = slackUserId;
    this.name = name;
    this.icon = icon;
    this.office = office;
  }
}

interface CreateUserRequestParams {
  slackUserId: string;
  name: string;
  icon: string;
  office?: string;
}

export class User {
  slackUserId: string;
  name: string;
  icon: string;
  office?: string;
  constructor(record: any) {
    this.slackUserId = record.slackUserId;
    this.name = record.name;
    this.icon = record.icon;
    this.office = record.office;
  }
}
