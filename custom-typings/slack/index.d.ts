declare module 'slack' {
  export interface Message {
    text: string;
    response_type: 'in_channel' | 'ephemeral';
    attachments: Attachment[];
  }

  export interface Attachment {
    title?: string;
    text: string;
    color: string;
    attachment_type: string;
    callback_id: string;
    fields: Field[];
    actions: Action[];
  }

  export interface Field {
    title: string;
    value: string;
    short: boolean;
  }

  export interface Action {
    name: string;
    text: string;
    value: string;
    type: string;
    style: string;
    confirm?: ConfirmAction;
  }

  export interface ConfirmAction {
    title: string;
    text: string;
    ok_text: string;
    dismiss_text: string;
  }
}
