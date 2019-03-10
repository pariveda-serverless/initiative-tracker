import { TextElement, SelectElement, SelectElementOption, Dialog } from 'slack';
import { InitiativeResponse, Status, getStatusDisplay } from '../initiative';
import { stringifyValue } from './id-helper';
import { InitiativeCallbackAction } from '../interactions';

export class EditInitiativeDialog {
  trigger_id: string;
  dialog: Dialog;
  constructor(initiative: InitiativeResponse, triggerId: string) {
    this.dialog = new InitiativeDialog(initiative);
    this.trigger_id = triggerId;
  }
}

export class InitiativeDialog implements Dialog {
  title = 'Update initiative';
  callback_id = InitiativeCallbackAction.EDIT_INITIATIVE_DIALOG;
  elements: (TextElement | SelectElement)[];
  state: string;
  constructor(initiative: InitiativeResponse) {
    const status = new StatusSelect(initiative);
    const name = new NameInput(initiative);
    const description = new DescriptionInput(initiative);
    const channel = new ChannelSelect(initiative);
    this.elements = [status, name, description, channel];
    this.state = stringifyValue({ initiativeId: initiative.initiativeId });
  }
}

class StatusSelect implements SelectElement {
  label = 'Select a status for this initiative';
  name = 'status';
  value: string;
  type: 'select' = 'select';
  options: SelectElementOption[];
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.status;
    this.options = Object.values(Status).map(status => new StatusOption(getStatusDisplay(status), status));
  }
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
  label = 'Select a channel for this initiative';
  name = 'channelId';
  value: string;
  type: 'select' = 'select';
  data_source: 'channels' = 'channels';
  optional = true;
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.channel ? initiative.channel.id : null;
  }
}

class NameInput implements TextElement {
  label = 'Enter a new name for this initiative';
  name = 'name';
  type: 'text' = 'text';
  value: string;
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.name;
  }
}

class DescriptionInput implements TextElement {
  label = 'Enter a new description for this initiative';
  name = 'description';
  type: 'textarea' = 'textarea';
  value: string;
  optional: boolean = true;
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.description;
  }
}
