import { MarkdownText, Message, Section, DividerBlock, Action, ContextBlock } from 'slack';
import { InitiativeResponse, Status, getStatusDisplay } from '../initiatives';
import { InitiativeInformationAndViewDetails, CreatedBy, Divider } from './shared-messages';
import { Query } from '../queries';

export class ListResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor({ initiatives, channelId, slackUserId, query }: ListResponseProperties) {
    this.channel = channelId;
    if (!initiatives || !initiatives.length) {
      this.blocks = [new NoResults(query)];
    } else {
      const initiativeSections = initiatives
        .map(initiative => {
          const nameAndStatus = new InitiativeInformationAndViewDetails(initiative);
          let blocks: (Section | DividerBlock | Action | ContextBlock)[] = [nameAndStatus];
          const metaInformation = new CreatedBy(initiative);
          const divider = new Divider();
          blocks = [...blocks, metaInformation, divider];
          return blocks;
        })
        .reduce((all, block) => all.concat(block), [])
        // Remove the last divider block
        .slice(0, -1);
      this.blocks = [new ResultsHeader(slackUserId, query), ...initiativeSections, new ResultsFooter()];
    }
  }
}

interface ListResponseProperties {
  initiatives: InitiativeResponse[];
  channelId: string;
  slackUserId: string;
  query?: Query;
}

class ResultsHeader implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  block_id: string;
  constructor(slackUserId: string, query: Query) {
    const status = query && query.status ? query.status : undefined;
    const isPublic = query && query.isPublic ? query.isPublic : undefined;
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

class ResultsFooter implements Section {
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
    const status = query && query.status ? query.status : undefined;
    const search = status ? `*${getStatusDisplay(status).toLowerCase()}* ` : '';
    const text = `Darn, we couldn't find any ${search}initiatives :thinking_face: ...  maybe you should add one! :muscle:
    :tada: */add-initiative [name], [optional description], [optional #channel]* :confetti_ball:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}
