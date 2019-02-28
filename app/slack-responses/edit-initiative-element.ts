import { TextElement, DialogError } from 'slack';
import { InitiativeResponse, Status } from '../initiative';

export enum EditInitiativeFieldName {
  INITIATIVE_NAME = 'initiative_name',
  INITIATIVE_DESCRIPTION = 'initiative_description'
}

export enum EditInitiativeFieldError {
  EMPTY_ERROR = 'This field cannot be empty',
  UNCHANGED_ERROR = 'Please update a field'
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
