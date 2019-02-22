import { Dialog, TextElement, SelectElement } from 'slack';
import { InitiativeResponse } from '../initiative';
import { EditInitiativeName, EditInitiativeDescription } from './edit-initiative-element';

export class EditInitiativeDialogResponse implements Dialog {
  title: string;
  callback_id: string;
  elements: (TextElement | SelectElement)[];
  constructor(initiative: InitiativeResponse, callback_id: string) {
    this.title = 'Update Initiative';
    this.callback_id = 'editcallbacktest'; //callback_id;
    const nameField = new EditInitiativeName(initiative);
    const descriptionField = new EditInitiativeDescription(initiative);
    this.elements = [nameField, descriptionField];
  }
}
