export const MEMBER_TYPE: string = 'MEMBER:';

export class CreateMemberRequest {
  initiativeId: string;
  type: string;
  name: string;
  slackUserId: string;
  champion: boolean;

  constructor({ initiativeId, name, slackUserId, champion = false }: CreateMemberRequestProperties) {
    this.initiativeId = initiativeId;
    this.type = `${MEMBER_TYPE}${slackUserId}`;
    this.name = name;
    this.slackUserId = slackUserId;
    this.champion = champion;
  }
}

interface CreateMemberRequestProperties {
  initiativeId: string;
  name: string;
  slackUserId: string;
  champion: boolean;
}

export class MemberResponse {
  initiativeId: string;
  name: string;
  champion: boolean;

  constructor(record: any) {
    this.initiativeId = record.initaitiveId;
    this.name = record.name;
    this.champion = record.champion;
  }
}
