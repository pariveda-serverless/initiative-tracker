import { TextElement, DialogError, SelectElement, SelectElementOption, Dialog } from 'slack';
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
  title: string;
  callback_id: string;
  elements: (TextElement | SelectElement)[];
  state: string;
  constructor(initiative: InitiativeResponse) {
    this.title = 'Update Initiative';
    this.callback_id = InitiativeCallbackAction.EDIT_INITIATIVE_DIALOG;
    const status = new StatusSelect(initiative);
    const name = new NameInput(initiative);
    const description = new DescriptionInput(initiative);
    const channel = new ChannelSelect(initiative);
    this.elements = [status, name, description, channel];
    // this.state = JSON.stringify({
    //   name: initiative.name,
    //   description: initiative.description,
    //   status: initiative.status,
    //   channelId: initiative.channel ? initiative.channel.id : null,
    //   initiativeId: initiative.initiativeId
    // });
    this.state = stringifyValue({ initiativeId: initiative.initiativeId });
  }
}

enum EditInitiativeFieldName {
  NAME = 'name',
  DESCRIPTION = 'description',
  STATUS = 'status',
  CHANNEL_ID = 'channelId'
}

// enum EditInitiativeFieldError {
//   EMPTY = 'This field cannot be empty',
//   UNCHANGED = 'Please update a field'
// }

class StatusSelect implements SelectElement {
  label: string;
  name: string;
  value: string;
  type: 'select';
  options: SelectElementOption[];
  constructor(initiative: InitiativeResponse) {
    this.name = EditInitiativeFieldName.STATUS;
    this.label = 'Select a status for this initiative';
    this.value = initiative.status;
    this.options = Object.values(Status).map(status => new StatusOption(getStatusDisplay(status), status));
    this.type = 'select';
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
  name = EditInitiativeFieldName.CHANNEL_ID;
  value: string;
  type: 'select' = 'select';
  data_source: 'channels' = 'channels';
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.channel ? initiative.channel.id : null;
  }
}

class NameInput implements TextElement {
  label: string;
  name: string;
  type: string;
  value: string;
  constructor(initiative: InitiativeResponse) {
    this.name = EditInitiativeFieldName.NAME;
    this.label = 'Enter a new name for this initiative';
    this.value = initiative.name;
    this.type = 'text';
  }
}

class DescriptionInput implements TextElement {
  label: string;
  name: string;
  type: string;
  value: string;
  optional: boolean;
  constructor(initiative: InitiativeResponse) {
    this.name = EditInitiativeFieldName.DESCRIPTION;
    this.label = 'Enter a new description for this initiative';
    this.value = initiative.description;
    this.type = 'textarea';
    this.optional = true;
  }
}

// export class DialogFieldError implements DialogError {
//   name: string;
//   error: string;
//   constructor(fieldName: EditInitiativeFieldName, fieldError: EditInitiativeFieldError) {
//     this.name = fieldName;
//     this.error = fieldError;
//   }
// }
