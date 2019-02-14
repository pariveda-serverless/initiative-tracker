declare module 'slack' {
  export interface Payload {
    callback_id: string;
    type: string;
    team: {
      id: string;
      domain: string;
    };
    user: {
      id: string;
      team_id: string;
    };
    actions: [
      {
        action_id: string;
        block_id: string;
        text: {
          type: string;
          text: string;
          emoji: string;
        };
        value: string;
        type: string;
        action_ts: string;
      }
    ];
  }

  export interface Message {
    text?: string;
    response_type: 'in_channel' | 'ephemeral';
    mrkdwn?: boolean;
    attachments?: Attachment[];
  }

  export interface Block {
    type: string;
    text: string;
    fields: Field[];
    accessory: Image | Button | StaticSelect;
  }

  export interface StaticSelect {
    type: 'static_select';
    placeholder: string;
    action_id: string;
    options: Option[];
    option_groups?: OptionGroup[];
    initial_option?: Option;
    confirm?: Confirmation;
  }

  export interface Option {
    text: PlainTextObject;
    value: string;
  }

  export interface OptionGroup {
    label: PlainTextObject;
    options: Option[];
  }

  export interface PlainTextObject {
    type: 'plain_text';
    text: string;
    emoji?: boolean;
    varbatim?: boolean;
  }

  export interface MarkdownTextObject {
    type: 'mrkdwn';
    text: string;
    emoji?: boolean;
    verbatim?: boolean;
  }

  export interface Button {
    type: 'button';
    text: string;
    action_id: string;
    url?: string;
    value?: string;
    confirm?: Confirmation;
  }

  export interface Image {
    type: 'image';
    image_url: string;
    alt_text: string;
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
    callback_id?: string;
    fields?: Field[];
    actions?: Action[];
    ts?: number;
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

  export interface Confirmation {
    title: PlainTextObject;
    text: PlainTextObject | MarkdownTextObject;
    confirm: PlainTextObject;
    deny: PlainTextObject;
  }

  export interface ConfirmAction {
    title: string;
    text: string;
    ok_text: string;
    dismiss_text: string;
  }
}
