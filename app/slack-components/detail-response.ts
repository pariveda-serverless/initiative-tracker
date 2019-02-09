import { Message, Attachment, Field, Action, ConfirmAction } from 'slack';
import { InitiativeResponse } from '../initiative';
import { MEMBER_INTENT_DISPLAY, INITIATIVE_INTENT_DISPLAY, MEMBER_DISPLAY } from './display';
import { InitiativeIntent, ActionType, MemberIntent } from '../interactions';
import { MemberResponse } from '../member';

export class DetailResponse implements Message {
  text: string;
  response_type: 'in_channel' | 'ephemeral';
  attachments: Attachment[];
  constructor(initiative: InitiativeResponse) {
    this.text = initiative.name;
    this.response_type = 'ephemeral';
    this.attachments = initiative.members.map(member => new MemberCard(member, initiative));
    // TODO add an attachment for initiative itself, wich intents being join and join (no view details)
  }
}

class MemberCard implements Attachment {
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: Field[];
  actions: Action[];

  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    this.text = member.name;
    const memberType = member.champion ? 'CHAMPION' : 'MEMBER';
    this.color = MEMBER_DISPLAY[memberType].color;
    this.attachment_type = 'default'; //TODO what are the other options?
    this.callback_id = ActionType.MEMBER_ACTION;
    this.actions = Object.values(MemberIntent)
      .filter(intent => (member.champion ? intent !== MemberIntent.MAKE_CHAMPION : intent !== MemberIntent.MAKE_MEMBER))
      .map(intent => new MemberAction(member, initiative, intent));
  }
}

class MemberAction implements Action {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;
  confirm: ConfirmAction;

  constructor(member: MemberResponse, initiative: InitiativeResponse, intent: MemberIntent) {
    this.name = intent;
    this.style = MEMBER_INTENT_DISPLAY[intent].style;
    this.value = initiative.initiativeId;
    this.text = MEMBER_INTENT_DISPLAY[intent].text;
    this.type = 'button'; //TODO what are the other options?
    this.confirm = new MemberActionConfirmation(member, intent);
  }
}

class MemberActionConfirmation implements ConfirmAction {
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
