import { InitiativeResponse } from '../initiative';
import { MEMBER_INTENT_DISPLAY, INITIATIVE_INTENT_DISPLAY, MEMBER_DISPLAY, STATUS_DISPLAY } from './display';
import { InitiativeIntent, Action, MemberIntent } from '../interactions';
import { MemberResponse } from '../member';
import { SlackInitiativeAction, SlackStatusField, SlackDescriptionField } from './list-response';
import { SlackAttachment, SlackField, SlackAction } from './interfaces';

export class SlackDetailResponse {
  text: string;
  response_type: string;
  attachments: SlackAttachment[];
  constructor(initiative: InitiativeResponse) {
    this.text = initiative.name;
    this.response_type = 'ephemeral'; //TODO what are the other options?
    const initiativeAttachment = new SlackDetailedInitiativeResponse(initiative);
    const memberAttachments = initiative.members.map(member => new SlackMemberResponse(member, initiative));
    this.attachments = [initiativeAttachment, ...memberAttachments];
  }
}

class SlackDetailedInitiativeResponse implements SlackAttachment {
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
    this.attachment_type = 'default';
    this.callback_id = Action.INITIATIVE_ACTION;
    const statusField = new SlackStatusField(initiative.status);
    const descriptionField = new SlackDescriptionField(initiative);
    this.fields = [statusField, descriptionField];

    this.actions = Object.values(InitiativeIntent).map(intent => new SlackInitiativeAction(initiative, intent));
  }
}

class SlackMemberResponse implements SlackAttachment {
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: SlackField[];
  actions: SlackMemberAction[];

  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    this.text = member.name;
    const memberType = member.champion ? 'CHAMPION' : 'MEMBER';
    this.color = MEMBER_DISPLAY[memberType].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = Action.MEMBER_ACTION;
    this.actions = Object.values(MemberIntent)
      .filter(intent => (member.champion ? intent !== MemberIntent.MAKE_CHAMPION : intent !== MemberIntent.MAKE_MEMBER))
      .map(intent => new SlackMemberAction(member, initiative, intent));
  }
}

class SlackMemberAction implements SlackAction {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;
  confirm: SlackConfirmAction;

  constructor(member: MemberResponse, initiative: InitiativeResponse, intent: MemberIntent) {
    this.name = intent;
    this.style = MEMBER_INTENT_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = MEMBER_INTENT_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
    this.confirm = new SlackConfirmAction(member, intent);
  }
}

class SlackConfirmAction {
  title: string;
  text: string;
  ok_text: string = 'Yes';
  dismiss_text: string = 'No';

  constructor(member: MemberResponse, intent: MemberIntent) {
    const { verb, action, title } = MEMBER_INTENT_DISPLAY[intent].confirmation;
    this.title = title;
    this.text = `Are you sure you want to ${verb} ${member.name} ${action}?`;
  }
}
