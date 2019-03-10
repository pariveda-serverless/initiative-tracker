import { Dialog, DialogError, TextElement, SelectElement } from 'slack';
import { InitiativeResponse } from '../initiative';
import {
  NameInput,
  StatusSelect,
  DescriptionInput,
  EditInitiativeFieldName,
  DialogFieldError,
  EditInitiativeFieldError,
  ChannelSelect
} from './edit-initiative-element';
import { InitiativeCallbackAction } from '../interactions';
import { stringifyValue } from './id-helper';

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

export class EditInitiativeFieldValidator {
  errors: DialogError[];
  constructor(
    initiativeName: string,
    initiativeDescription: string,
    initiativeStatus: string,
    oldInitiativeName: string,
    oldInitiativeDescription: string,
    oldInitiativeStatus: string
  ) {
    if (
      initiativeName === oldInitiativeName &&
      initiativeDescription === oldInitiativeDescription &&
      initiativeStatus === oldInitiativeStatus
    ) {
      this.errors = [
        new DialogFieldError(EditInitiativeFieldName.NAME, EditInitiativeFieldError.UNCHANGED_ERROR),
        new DialogFieldError(EditInitiativeFieldName.DESCRIPTION, EditInitiativeFieldError.UNCHANGED_ERROR),
        new DialogFieldError(EditInitiativeFieldName.STATUS, EditInitiativeFieldError.UNCHANGED_ERROR)
      ];
    } else {
      this.errors = [];
    }
  }
}
