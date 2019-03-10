import { TextElement, DialogError, SelectElement, SelectElementOption } from 'slack';
import { InitiativeResponse, Status, getStatusDisplay } from '../initiative';

export enum EditInitiativeFieldName {
  NAME = 'name',
  DESCRIPTION = 'description',
  STATUS = 'status',
  CHANNEL_ID = 'channelId'
}

export enum EditInitiativeFieldError {
  EMPTY = 'This field cannot be empty',
  UNCHANGED = 'Please update a field'
}

export class StatusSelect implements SelectElement {
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
export class ChannelSelect implements SelectElement {
  label = 'Select a channel for this initiative';
  name = EditInitiativeFieldName.CHANNEL_ID;
  value: string;
  type: 'select' = 'select';
  data_source: 'channels' = 'channels';
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.channel ? initiative.channel.id : null;
  }
}

export class NameInput implements TextElement {
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

export class DescriptionInput implements TextElement {
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

export class DialogFieldError implements DialogError {
  name: string;
  error: string;
  constructor(fieldName: EditInitiativeFieldName, fieldError: EditInitiativeFieldError) {
    this.name = fieldName;
    this.error = fieldError;
  }
}
