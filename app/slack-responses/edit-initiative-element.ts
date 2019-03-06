import { TextElement, DialogError, SelectElement, SelectElementOption } from 'slack';
import { InitiativeResponse, Status, getStatusDisplay } from '../initiative';

export enum EditInitiativeFieldName {
  INITIATIVE_NAME = 'initiative_name',
  INITIATIVE_DESCRIPTION = 'initiative_description',
  INITIATIVE_STATUS = 'initiative_status',
  INITIATIVE_CHANNEL = 'INITIATIVE_CHANNEL'
}

export enum EditInitiativeFieldError {
  EMPTY_ERROR = 'This field cannot be empty',
  UNCHANGED_ERROR = 'Please update a field'
}

export class SelectIniatitiveStatus implements SelectElementOption {
  label: string;
  value: string;
  constructor(label: string, value: string) {
    this.label = label;
    this.value = value;
  }
}

export class EditInitiativeStatus implements SelectElement {
  label: string;
  name: string;
  value: string;
  type: 'select';
  options: SelectElementOption[];
  constructor(initiative: InitiativeResponse) {
    this.name = EditInitiativeFieldName.INITIATIVE_STATUS;
    this.label = 'Select a status for this initiative';
    this.value = initiative.status;
    this.options = Object.values(Status).map(status => new SelectIniatitiveStatus(getStatusDisplay(status), status));
    this.type = 'select';
  }
}

// https://api.slack.com/dialogs#select_elements
export class EditInitiativeChannel implements SelectElement {
  label: string = 'Select a channel for this initiative';
  name: string;
  // value: string;
  type: 'select';
  data_source: 'channels' = 'channels';
  constructor(initiative: InitiativeResponse) {
    // this.value = initiative.channel.name;
  }
}

export class EditInitiativeName implements TextElement {
  label: string;
  name: string;
  type: string;
  value: string;
  constructor(initiative: InitiativeResponse) {
    this.name = EditInitiativeFieldName.INITIATIVE_NAME;
    this.label = 'Enter a new name for this initiative';
    this.value = initiative.name;
    this.type = 'text';
  }
}

export class EditInitiativeDescription implements TextElement {
  label: string;
  name: string;
  type: string;
  value: string;
  optional: boolean;
  constructor(initiative: InitiativeResponse) {
    this.name = EditInitiativeFieldName.INITIATIVE_DESCRIPTION;
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
