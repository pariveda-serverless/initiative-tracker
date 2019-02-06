import { InitiativeResponse } from '../initiative';
import { STATUS_DISPLAY, INTENT_DISPLAY, MEMBER_DISPLAY } from './display';
import { Intent, Action } from '../interactions';
import { MemberResponse } from '../member';

export class SlackDetailResponse {
  text: string;
  response_type: string;
  attachments: SlackMemberResponse[];
  constructor(initiative: InitiativeResponse) {
    this.text = initiative.name;
    this.response_type = 'in_channel'; //TODO what are the other options?
    this.attachments = initiative.members.map(member => new SlackMemberResponse(member));
  }
}

class SlackMemberResponse {
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: SlackField[];
  actions: SlackJoinButton[];

  constructor(member: MemberResponse) {
    this.text = member.name;
    const memberType = member.champion ? 'CHAMPION' : 'MEMBER';
    this.color = MEMBER_DISPLAY[memberType].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    // this.callback_id = Action.LIST_ACTIONS;
    // this.actions = Object.values(Intent).map(intent => new SlackJoinButton(initiative, intent));
  }
}

class SlackField {
  title: string;
  value: string;
  short: boolean;
}

class SlackJoinButton {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;

  constructor(initiative: InitiativeResponse, intent: Intent) {
    this.name = intent;
    this.style = INTENT_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = INTENT_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
  }
}
