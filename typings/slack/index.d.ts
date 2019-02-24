declare module 'slack' {
  export type ActionResponse = Dialog | Message;
  // https://api.slack.com/dialogs#implementation
  export interface Dialog {
    title: string;
    callback_id: string;
    elements: (TextElement | SelectElement)[];
    state?: string;
    submit_label?: string;
    notify_on_cancel?: string;
  }

  // https://api.slack.com/dialogs#elements
  export interface TextElement {
    label: string;
    name: string;
    type: string;
    max_length?: number;
    min_length?: number;
    optional?: boolean;
    hint?: string;
    subtype?: string;
    value?: string;
    placeholder?: string;
  }

  // https://api.slack.com/dialogs#elements
  export interface SelectElement {
    label: string;
    name: string;
    type?: string;
    data_source?: 'users' | 'channels' | 'conversations' | 'external';
    min_query_length?: number;
    placeholder?: string;
    optional?: boolean;
    value?: string;
    selected_options?: string[];
    options?: string[];
    option_groups?: string[];
  }

  // https://api.slack.com/reference/messaging/payload
  export interface Message {
    channel?: string;
    text?: PlainText | MarkdownText;
    blocks?: any[];
    attachments?: any[];
    thread_ts?: string;
    mrkdwn?: boolean;
  }

  // https://api.slack.com/reference/messaging/blocks
  export interface Section {
    type: 'section';
    text?: PlainText | MarkdownText;
    block_id?: string;
    fields?: (PlainText | MarkdownText)[];
    accessory?: ImageContext | Button | StaticSelect;
  }

  export interface DividerBlock {
    type: 'divider';
    block_id?: string;
  }

  export interface Image {
    type: 'image';
    image_url: string;
    alt_text: string;
    title: string;
    block_id?: string;
  }

  export interface Action {
    type: 'actions';
    elements: (StaticSelect | Button)[];
    block_id?: string;
  }

  export interface ContextBlock {
    type: 'context';
    elements: (ImageContext | PlainText | MarkdownText)[];
    block_id?: string;
  }

  // https://api.slack.com/reference/messaging/block-elements
  export interface ImageContext {
    type: 'image';
    image_url: string;
    alt_text: string;
  }

  export interface Button {
    type: 'button';
    text: PlainText;
    action_id: string;
    url?: string;
    value?: string;
    confirm?: Confirmation;
  }

  export interface StaticSelect {
    type: 'static_select';
    placeholder: PlainText | MarkdownText;
    action_id: string;
    options: Option[];
    option_groups?: OptionGroup[];
    initial_option?: Option;
    confirm?: Confirmation;
  }

  // https://api.slack.com/reference/messaging/composition-objects
  export interface PlainText {
    type: 'plain_text';
    text: string;
    emoji?: boolean;
    varbatim?: boolean;
  }

  export interface MarkdownText {
    type: 'mrkdwn';
    text: string;
    verbatim?: boolean;
  }

  export interface Confirmation {
    title: PlainText;
    text: PlainText | MarkdownText;
    confirm: PlainText;
    deny: PlainText;
  }

  export interface Option {
    text: PlainText;
    value: string;
  }

  export interface OptionGroup {
    label: PlainText;
    options: Option[];
  }

  // Slash command body
  export interface Command {
    command: string;
    text: string;
    response_url: string;
    trigger_id: string;
    user_id: string;
    team_id: string;
    team_name: string;
    channel_id: string;
    channel_name: string;
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
        callback_id: string;
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

  export interface AccessTokenResponse {
    ok: boolean;
    access_token: string;
    team_name: string;
    team_id: string;
  }
}
