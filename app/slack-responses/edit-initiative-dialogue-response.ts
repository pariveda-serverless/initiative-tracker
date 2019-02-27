import { Dialog, TextElement, SelectElement } from 'slack';
import { InitiativeResponse } from '../initiative';
import { EditInitiativeName, EditInitiativeDescription } from './edit-initiative-element';
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
    this.callback_id = InitiativeCallbackAction.EDIT_INITIATIVE_DIALOG_CALLBACK_ID;
    const nameField = new EditInitiativeName(initiative);
    const descriptionField = new EditInitiativeDescription(initiative);
    this.elements = [nameField, descriptionField];
    this.state = JSON.stringify({originalName: initiative.name, originalDescription: initiative.description, initiativeId: initiative.initiativeId})
  }
}
