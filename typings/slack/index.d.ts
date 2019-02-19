declare module 'slack' {
  // TODO DELETE FROM HERE
  export interface OldMessage {
    channel?: string;
    text?: string;
    response_type: 'in_channel' | 'ephemeral';
    mrkdwn?: boolean;
    attachments?: Attachment[];
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

  export interface ConfirmAction {
    title: string;
    text: string;
    ok_text: string;
    dismiss_text: string;
  }
  // TODO DELETE TO HERE

  // https://api.slack.com/reference/messaging/payload
  export interface Message {
    channel?: string;
    text?: PlainTextObject | MarkdownTextObject;
    blocks?: any[];
    attachments?: any[];
    thread_ts?: string;
    mrkdwn?: boolean;
  }

  // https://api.slack.com/reference/messaging/blocks
  export interface SectionBlock {
    type: 'section';
    text?: PlainTextObject | MarkdownTextObject;
    block_id?: string;
    fields?: (PlainTextObject | MarkdownTextObject)[];
    accessory?: Image | Button | StaticSelect;
  }

  export interface DividerBlock {
    type: 'divider';
    block_id?: string;
  }

  export interface ImageBlock {
    type: 'image';
    image_url: string;
    alt_text: string;
    title: string;
    block_id?: string;
  }

  export interface ActionsBlock {
    type: 'actions';
    elements: (StaticSelect | Button)[];
    block_id?: string;
  }

  export interface ContextBlock {
    type: 'context';
    elements: (Image | PlainTextObject | MarkdownTextObject)[];
    block_id?: string;
  }

  // https://api.slack.com/reference/messaging/block-elements
  export interface Image {
    type: 'image';
    image_url: string;
    alt_text: string;
  }

  export interface Button {
    type: 'button';
    text: PlainTextObject;
    action_id: string;
    url?: string;
    value?: string;
    confirm?: Confirmation;
  }

  export interface StaticSelect {
    type: 'static_select';
    placeholder: PlainTextObject | MarkdownTextObject;
    action_id: string;
    options: Option[];
    option_groups?: OptionGroup[];
    initial_option?: Option;
    confirm?: Confirmation;
  }

  // https://api.slack.com/reference/messaging/composition-objects
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

  export interface Confirmation {
    title: PlainTextObject;
    text: PlainTextObject | MarkdownTextObject;
    confirm: PlainTextObject;
    deny: PlainTextObject;
  }

  export interface Option {
    text: PlainTextObject;
    value: string;
  }

  export interface OptionGroup {
    label: PlainTextObject;
    options: Option[];
  }

  // Action payload received on button click
  export interface Payload {
    type: string;
    team: {
      id: string;
      domain: string;
    };
    user: {
      id: string;
      team_id: string;
    };
    channel: {
      id: string;
      name: string;
    };
    response_url: string;
    actions: [
      {
        action_id: string;
        block_id: string;
        text: {
          type: string;
          text: string;
          emoji: boolean;
        };
        value: string;
        type: string;
        action_ts: string;
        selected_option: {
          text: {
            type: string;
            text: string;
            emoji: boolean;
          };
          value: string;
        };
      }
    ];
  }
}
