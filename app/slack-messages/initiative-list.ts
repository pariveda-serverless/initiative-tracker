import {
  MarkdownText,
  Message,
  Section,
  DividerBlock,
  Action,
  ContextBlock,
  StaticSelect,
  Option,
  PlainText
} from 'slack';
import { Initiative, Status, getStatusDisplay } from '../initiatives';
import { InitiativeInformationAndViewDetails, CreatedBy, Divider } from './shared-messages';
import { Query } from '../queries';
import { ListAction, stringifyValue } from '../interactivity';

export class ListResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor({ initiatives, channelId, slackUserId, query }: ListResponseProperties) {
    this.channel = channelId;
    if (!initiatives || !initiatives.length) {
      this.blocks = [new NoResults(query)];
    } else {
      this.blocks = getInitiativeList(initiatives, slackUserId, query);
    }
  }
}

function getInitiativeList(
  initiatives: Initiative[],
  slackUserId: string,
  query: Query
): (Section | DividerBlock | Action | ContextBlock)[] {
  const initiativeSections = initiatives
    // if a status was specified in query, filter to initiatives with that status
    .filter(initiative => !query || !query.status || query.status === initiative.status)
    // if an office was specified in query, filter to initiatives in that office
    .filter(initiative => !query || !query.office || query.office === initiative.office)
    .map(initiative => {
      return [new InitiativeInformationAndViewDetails(initiative), new CreatedBy(initiative), new Divider()];
    })
    // flatten the array of arrays into a single array
    .reduce((all, block) => all.concat(block), []);
  return [
    new Header(slackUserId, query),
    new Filter(initiatives, query),
    new Divider(),
    ...initiativeSections,
    new Footer()
  ];
}

interface ListResponseProperties {
  initiatives: Initiative[];
  channelId: string;
  slackUserId: string;
  query?: Query;
}

class Header implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  block_id: string;
  constructor(slackUserId: string, query: Query) {
    const status = query && query.status;
    const isPublic = query && query.isPublic;
    const search = status ? `${getStatusDisplay(status).toLowerCase()}` : ' ';
    const searchBold = status ? ` *${getStatusDisplay(status).toLowerCase()}* ` : ' ';
    const searchCommand = status ? `*/show-initiatives public, ${search}*` : '*/show-initiatives public*';
    const publicNote = `, sharing <!here> because <@${slackUserId}> requested it with the ${searchCommand} slash command`;
    const text = `Here are all the${searchBold}initiatives we could find :bookmark_tabs:${
      isPublic ? publicNote : ''
    }`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}

class Filter implements Action {
  type: 'actions' = 'actions';
  elements: StaticSelect[];
  constructor(initiatives: Initiative[], query: Query) {
    const statuses = [...new Set(initiatives.map(initiative => initiative.status))];
    const statusFilter = new StatusFilter(statuses, query && query.status);
    this.elements = [statusFilter];
    const offices = [
      ...new Set(initiatives.filter(initiative => initiative.office).map(initiative => initiative.office))
    ];
    if (offices && offices.length) {
      this.elements.push(new OfficeFilter(offices, query && query.office));
    }
  }
}

class OfficeFilter implements StaticSelect {
  type: 'static_select' = 'static_select';
  placeholder: PlainText;
  options: Option[];
  initial_option: Option;
  action_id = ListAction.FILTER_BY_OFFICE;
  constructor(offices: string[], office: string) {
    this.placeholder = {
      type: 'plain_text',
      text: 'Filter by office',
      emoji: true
    };
    this.initial_option = office ? new OfficeOption(office) : new ViewAllOption();
    const options = offices.map(office => new OfficeOption(office));
    this.options = [new ViewAllOption(), ...options];
  }
}

class OfficeOption implements Option {
  text: PlainText;
  value: string;
  constructor(office: string) {
    this.text = {
      type: 'plain_text',
      text: office
    };
    this.value = stringifyValue({ office });
  }
}

class StatusFilter implements StaticSelect {
  type: 'static_select' = 'static_select';
  placeholder: PlainText;
  options: Option[];
  initial_option: Option;
  action_id = ListAction.FILTER_BY_STATUS;
  constructor(statuses: Status[], status: Status) {
    this.placeholder = {
      type: 'plain_text',
      text: 'Filter by status',
      emoji: true
    };
    const options = statuses.map(status => new StatusOption(Status[status]));
    this.options = [new ViewAllOption(), ...options];
    this.initial_option = status ? new StatusOption(Status[status]) : new ViewAllOption();
  }
}

class ViewAllOption implements Option {
  text: PlainText = {
    type: 'plain_text',
    text: 'View all'
  };
  value: string = stringifyValue({});
  constructor() {}
}

class StatusOption implements Option {
  text: PlainText;
  value: string;
  constructor(status: Status) {
    this.text = {
      type: 'plain_text',
      text: getStatusDisplay(status)
    };
    this.value = stringifyValue({ status });
  }
}

class Footer implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor() {
    const text = `Not seeing an initiative you want to join? :thinking_face: You should start a new one! :muscle:
    :tada: */add-initiative [name], [optional description], [optional #channel]* :confetti_ball:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}

class NoResults implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(query: Query) {
    const status = query && query.status;
    const search = status ? `*${getStatusDisplay(status).toLowerCase()}* ` : '';
    const text = `Darn, we couldn't find any ${search}initiatives :thinking_face: ...  maybe you should add one! :muscle:
    :tada: */add-initiative [name], [optional description], [optional #channel]* :confetti_ball:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}
