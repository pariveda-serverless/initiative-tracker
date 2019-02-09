declare module 'slack' {
  export interface Message {
    text: string;
    response_type: 'in_channel' | 'ephemeral';
    mrkdwn?: boolean;
    attachments: Attachment[];
  }

  export interface Attachment {
    title?: string;
    title_link?: string;
    pretext?: string;
    text?: string;
    color?: string;
    mrkdwn_in?: string[];
    image_url?: string;
    thumb_url?: string;
    footer?: string;
    footer_icon?: string;
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
