import { SelectElement, SelectElementOption, Dialog } from 'slack';
import { InitiativeResponse } from '../initiatives';
import { stringifyValue, InitiativeAction } from '../interactivity';

export class AddMemberDialog {
  trigger_id: string;
  dialog: Dialog;
  constructor(initiative: InitiativeResponse, triggerId: string) {
    this.dialog = new MemberDialog(initiative);
    this.trigger_id = triggerId;
  }
}

export class MemberDialog implements Dialog {
  title = 'Add member';
  callback_id = InitiativeAction.ADD_MEMBER;
  elements: SelectElement[];
  state: string;
  constructor(initiative: InitiativeResponse) {
    const member = new MemberSelect();
    const role = new RoleSelect();
    this.elements = [member, role];
    this.state = stringifyValue({ initiativeId: initiative.initiativeId });
  }
}

// https://api.slack.com/dialogs#select_elements
class MemberSelect implements SelectElement {
  label = 'Member';
  name = 'slackUserId';
  value: string;
  type: 'select' = 'select';
  data_source: 'users' = 'users';
  constructor() {}
}

class RoleSelect implements SelectElement {
  label = 'Role';
  name = 'role';
  value: boolean;
  type: 'select' = 'select';
  options: SelectElementOption[];
  constructor() {
    const champion = { label: 'Champion', value: true };
    const member = { label: 'Member', value: false };
    this.value = member.value;
    this.options = [champion, member];
  }
}
