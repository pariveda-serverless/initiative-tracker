import { InitiativeResponse } from '../initiative';
import { STATUS_DISPLAY, INITIATIVE_INTENT_DISPLAY } from './display';
import { InitiativeIntent, Action } from '../interactions';
import { Status } from '../status';
// import { MemberResponse } from '../member';
import { SlackAttachment, SlackAction, SlackField } from './interfaces';

export class SlackListResponse {
  text: string;
  response_type: string;
  attachments: SlackAttachment[];
  constructor(initiatives: InitiativeResponse[]) {
    this.response_type = 'ephemeral'; //TODO what are the other options?
    this.attachments = initiatives.map(initiative => new SlackBasicInitiativeResponse(initiative));
  }
}

class SlackBasicInitiativeResponse implements SlackAttachment {
  title: string;
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: SlackField[];
  actions: SlackInitiativeAction[];

  constructor(initiative: InitiativeResponse) {
    this.title = initiative.name;
    this.color = STATUS_DISPLAY[initiative.status].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = Action.INITIATIVE_ACTION;

    const statusField = new SlackStatusField(initiative.status);
    const descriptionField = new SlackDescriptionField(initiative);
    // const championsField = new SlackMembersField(initiative.members, true);
    // const membersField = new SlackMembersField(initiative.members, false);
    // this.fields = [statusField, championsField, membersField];
    this.fields = [statusField, descriptionField];

    this.actions = Object.values(InitiativeIntent).map(intent => new SlackInitiativeAction(initiative, intent));
  }
}

export class SlackStatusField implements SlackField {
  title: string;
  value: string;
  short: boolean;
  constructor(status: Status) {
    this.title = 'Status';
    this.value = STATUS_DISPLAY[status].text;
    this.short = true;
  }
}

export class SlackDescriptionField implements SlackField {
  title: string;
  value: string;
  short: boolean;
  constructor(initiative: InitiativeResponse) {
    this.title = 'Description';
    this.value = initiative.description;
    this.short = true;
  }
}

// class SlackMembersField implements SlackField {
//   title: string;
//   value: string;
//   short: boolean;
//   constructor(members: MemberResponse[], champions: boolean) {
//     this.title = `${champions ? 'Champions' : 'Members'}`;
//     this.value = members.reduce((names, member) => {
//       return member.champion === champions ? `${names}, ${member.name}` : names;
//     }, '');
//     this.short = false;
//   }
// }

export class SlackInitiativeAction implements SlackAction {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;

  constructor(initiative: InitiativeResponse, intent: InitiativeIntent) {
    this.name = intent;
    this.style = INITIATIVE_INTENT_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = INITIATIVE_INTENT_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
  }
}
