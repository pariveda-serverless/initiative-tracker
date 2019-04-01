import { TextElement, SelectElement, SelectElementOption, Dialog } from 'slack';
import { InitiativeResponse, Status, getStatusDisplay } from '../initiatives';
import { stringifyValue, InitiativeAction } from '../interactivity';
import { Query } from '../queries';

export class EditInitiativeDialog {
  trigger_id: string;
  dialog: Dialog;
  constructor(initiative: InitiativeResponse, query: Query, triggerId: string) {
    this.dialog = new InitiativeDialog(initiative, query);
    this.trigger_id = triggerId;
  }
}

export class InitiativeDialog implements Dialog {
  title = 'Update initiative';
  callback_id = InitiativeAction.EDIT_INITIATIVE;
  elements: (TextElement | SelectElement)[];
  state: string;
  constructor(initiative: InitiativeResponse, query: Query) {
    const name = new NameInput(initiative);
    const description = new DescriptionInput(initiative);
    const channel = new ChannelSelect(initiative);
    const status = new StatusSelect(initiative);
    this.elements = [name, description, channel, status];
    this.state = stringifyValue({ initiativeId: initiative.initiativeId, queryId: query.queryId });
  }
}

class StatusSelect implements SelectElement {
  label = 'Status';
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
  label = 'Channel';
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
  label = 'Name';
  name = 'name';
  type: 'text' = 'text';
  value: string;
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.name;
  }
}

class DescriptionInput implements TextElement {
  label = 'Description';
  name = 'description';
  type: 'textarea' = 'textarea';
  value: string;
  optional: boolean = true;
  constructor(initiative: InitiativeResponse) {
    this.value = initiative.description;
  }
}
