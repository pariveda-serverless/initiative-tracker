import { Dialog, DialogError, TextElement, SelectElement } from 'slack';
import { InitiativeResponse } from '../initiative';
import {
  EditInitiativeName,
  EditInitiativeDescription,
  EditInitiativeFieldName,
  DialogFieldError,
  EditInitiativeFieldError
} from './edit-initiative-element';
import { InitiativeCallbackAction } from '../interactions';

export class EditInitiativeDialogResponse {
  trigger_id: string;
  dialog: Dialog;
  constructor(initiative: InitiativeResponse, triggerId: string) {
    this.dialog = new EditInitiativeDialog(initiative);
    this.trigger_id = triggerId;
  }
}

export class EditInitiativeDialog implements Dialog {
  title: string;
  callback_id: string;
  elements: (TextElement | SelectElement)[];
  state: string;
  constructor(initiative: InitiativeResponse) {
    this.title = 'Update Initiative';
    this.callback_id = InitiativeCallbackAction.EDIT_INITIATIVE_DIALOG;
    const nameField = new EditInitiativeName(initiative);
    const descriptionField = new EditInitiativeDescription(initiative);
    this.elements = [nameField, descriptionField];
    this.state = JSON.stringify({
      originalName: initiative.name,
      originalDescription: initiative.description,
      initiativeId: initiative.initiativeId
    });
  }
}

export class EditInitiativeFieldValidator {
  errors: DialogError[];
  constructor(
    initiativeName: string,
    initiativeDescription: string,
    oldInitiativeName: string,
    oldInitiativeDescription: string
  ) {
    if (initiativeName === oldInitiativeName && initiativeDescription === oldInitiativeDescription) {
      this.errors = [
        new DialogFieldError(EditInitiativeFieldName.INITIATIVE_NAME, EditInitiativeFieldError.UNCHANGED_ERROR),
        new DialogFieldError(EditInitiativeFieldName.INITIATIVE_DESCRIPTION, EditInitiativeFieldError.UNCHANGED_ERROR)
      ];
    } else {
      this.errors = [];
    }
  }
}
