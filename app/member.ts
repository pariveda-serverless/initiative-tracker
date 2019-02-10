export const MEMBER_TYPE: string = 'MEMBER:';

export class CreateMemberRequest {
  initiativeId: string;
  type: string;
  name: string;
  slackUserId: string;
  champion: boolean;
  icon: string;

  constructor({ initiativeId, name, slackUserId, champion = false, icon }: CreateMemberRequestProperties) {
    this.initiativeId = initiativeId;
    this.type = `${MEMBER_TYPE}${slackUserId}`;
    this.name = name;
    this.slackUserId = slackUserId;
    this.champion = champion;
    this.icon = icon;
  }
}

interface CreateMemberRequestProperties {
  initiativeId: string;
  name: string;
  slackUserId: string;
  champion: boolean;
  icon: string;
}

export class MemberResponse {
  initiativeId: string;
  name: string;
  champion: boolean;
  role: string;
  slackUserId: string;
  icon: string;

  constructor(record: any) {
    this.initiativeId = record.initaitiveId;
    this.name = record.name;
    this.champion = record.champion;
    this.role = record.champion ? 'CHAMPION' : 'MEMBER';
    this.slackUserId = record.slackUserId;
    this.icon = record.icon;
  }
}

export class DeleteMemberRequest {
  initiativeId: string;
  type: string;
  constructor({ initiativeId, slackUserId }: DeleteMemberRequestProperties) {
    this.initiativeId = initiativeId;
    this.type = `${MEMBER_TYPE}${slackUserId}`;
  }
}

interface DeleteMemberRequestProperties {
  initiativeId: string;
  slackUserId: string;
}
