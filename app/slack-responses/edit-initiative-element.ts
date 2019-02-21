import { TextElement } from 'slack';
import { InitiativeResponse, Status } from '../initiative';

export class EditInitiativeName implements TextElement {
  label: string;
  name: string;
  type: string;
  value: string;
  constructor(initiative: InitiativeResponse) {
    this.name = 'initiative_name';
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
    constructor(initiative: InitiativeResponse) {
      this.name = 'initiative_name';
      this.label = 'Enter a new description for this initiative';
      this.value = initiative.description;
      this.type = 'text';
    }
  }