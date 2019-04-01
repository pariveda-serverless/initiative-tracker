import { SelectElement, SelectElementOption, Dialog } from 'slack';
import { InitiativeResponse } from '../initiatives';
import { stringifyValue, InitiativeAction } from '../interactivity';
import { Query } from '../queries';

export class AddMemberDialog {
  trigger_id: string;
  dialog: Dialog;
  constructor(initiative: InitiativeResponse, query: Query, triggerId: string) {
    this.dialog = new MemberDialog(initiative, query);
    this.trigger_id = triggerId;
  }
}

export class MemberDialog implements Dialog {
  title = 'Add member';
  callback_id = InitiativeAction.ADD_MEMBER;
  elements: SelectElement[];
  state: string;
  constructor(initiative: InitiativeResponse, query: Query) {
    const member = new MemberSelect();
    const role = new RoleSelect();
    this.elements = [member, role];
    this.state = stringifyValue({ initiativeId: initiative.initiativeId, queryId: query.queryId });
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
  value: string;
  type: 'select' = 'select';
  options: SelectElementOption[];
  constructor() {
    const champion = { label: 'Champion', value: stringifyValue({ champion: true }) };
    const member = { label: 'Member', value: stringifyValue({ champion: false }) };
    this.value = member.value;
    this.options = [champion, member];
  }
}
