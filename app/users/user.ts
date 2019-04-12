export class CreateUserRequest {
  slackUserId: string;
  name: string;
  icon: string;
  office?: string;
  teamId: string;
  timestamp: string;
  constructor({ slackUserId, name, icon, office, teamId }: CreateUserRequestParams) {
    this.slackUserId = slackUserId;
    this.name = name;
    this.icon = icon;
    this.office = office;
    this.teamId = teamId;
    this.timestamp = new Date().toUTCString();
  }
}

interface CreateUserRequestParams {
  slackUserId: string;
  name: string;
  icon: string;
  office?: string;
  teamId: string;
}

export class User {
  slackUserId: string;
  name: string;
  icon: string;
  office?: string;
  teamId: string;
  constructor(record: any) {
    this.slackUserId = record.slackUserId;
    this.name = record.name;
    this.icon = record.icon;
    this.office = record.office;
    this.teamId = record.teamId;
  }
}
