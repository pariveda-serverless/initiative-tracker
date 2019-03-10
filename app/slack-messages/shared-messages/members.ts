import { Section, PlainText, MarkdownText, Overflow, Option } from 'slack';
import { MemberResponse, InitiativeResponse } from '../../common';
import { MemberAction, stringifyValue } from '../../interactivity';

export class MemberSection implements Section {
  type: 'section' = 'section';
  text: PlainText | MarkdownText;
  accessory: Overflow;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const nameAndRole: MarkdownText = {
      type: 'mrkdwn',
      text: `*${member.role}*  <@${member.slackUserId}> joined on ${member.joinedAt}`
    };
    this.text = nameAndRole;
    const memberActions = new MemberActions(member, initiative);
    this.accessory = memberActions;
  }
}

class MemberActions implements Overflow {
  type: 'overflow' = 'overflow';
  action_id: string;
  options: Option[];
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    this.action_id = MemberAction.UPDATE_ROLE;
    const changeMembership = new ChangeMembershipOption(member, initiative);
    const remove = new RemoveOption(member, initiative);
    this.options = [changeMembership, remove];
  }
}

class ChangeMembershipOption implements Option {
  text: PlainText;
  value: string;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const action = member.champion ? MemberAction.MAKE_MEMBER : MemberAction.MAKE_CHAMPION;
    this.text = {
      text: `${action === MemberAction.MAKE_CHAMPION ? 'Make champion' : 'Make member'}`,
      type: 'plain_text'
    };
    this.value = stringifyValue({ initiativeId: initiative.initiativeId, slackUserId: member.slackUserId, action });
  }
}

class RemoveOption implements Option {
  text: PlainText;
  value: string;
  constructor(member: MemberResponse, initiative: InitiativeResponse) {
    const action = MemberAction.REMOVE_MEMBER;
    this.text = { text: 'Remove from initiative', type: 'plain_text' };
    this.value = stringifyValue({
      initiativeId: initiative.initiativeId,
      slackUserId: member.slackUserId,
      action
    });
  }
}
