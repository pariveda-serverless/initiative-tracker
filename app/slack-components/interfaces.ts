export interface SlackAttachment {
  title?: string;
  text: string;
  color: string;
  attachment_type: string;
  callback_id: string;
  fields: SlackField[];
  actions: SlackAction[];
}

export interface SlackField {
  title: string;
  value: string;
  short: boolean;
}

export interface SlackAction {
  name: string;
  text: string;
  value: string;
  type: string;
  style: string;
  confirm?: SlackConfirmAction;
}

export interface SlackConfirmAction {
  title: string;
  text: string;
  ok_text: string;
  dismiss_text: string;
}
