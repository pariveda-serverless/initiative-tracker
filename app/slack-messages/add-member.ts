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
    this.elements = [member];
    this.state = stringifyValue({ initiativeId: initiative.initiativeId });
  }
}

// https://api.slack.com/dialogs#select_elements
class MemberSelect implements SelectElement {
  label = 'Member';
  name = 'member';
  value: string;
  type: 'select' = 'select';
  data_source: 'users' = 'users';
  constructor() {}
}

class StatusOption implements SelectElementOption {
  label: string;
  value: string;
  constructor(label: string, value: string) {
    this.label = label;
    this.value = value;
  }
}

// https://api.slack.com/dialogs#select_elements
class ChannelSelect implements SelectElement {
  label = 'Channel';
  name = 'channelId';
  value: string;
  type: 'select' = 'select';
  data_source: 'channels' = 'channels';
  optional = true;
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.channel ? initiative.channel.id : null;
  }
}
