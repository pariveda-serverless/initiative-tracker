import { MarkdownText, Message, Section, DividerBlock, Action, ContextBlock } from 'slack';
import { InitiativeResponse, Status, getStatusDisplay } from '../initiatives';
import { InitiativeInformationAndViewDetails, CreatedBy, Divider } from './shared-messages';

export class ListResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(
    initiatives: InitiativeResponse[],
    channelId: string,
    slackUserId: string,
    isPublic: boolean,
    status?: Status
  ) {
    this.channel = channelId;
    if (!initiatives || !initiatives.length) {
      this.blocks = [new NoResults(status)];
    } else {
      const initiativeSections = initiatives
        .map(initiative => {
          const nameAndStatus = new InitiativeInformationAndViewDetails(initiative, status);
          let blocks: (Section | DividerBlock | Action | ContextBlock)[] = [nameAndStatus];
          const metaInformation = new CreatedBy(initiative);
          const divider = new Divider();
          blocks = [...blocks, metaInformation, divider];
          return blocks;
        })
        .reduce((all, block) => all.concat(block), [])
        // Remove the last divider block
        .slice(0, -1);
      this.blocks = [new ResultsHeader(slackUserId, isPublic, status), ...initiativeSections, new ResultsFooter()];
    }
  }
}

class ResultsHeader implements Section {
  type: 'section' = 'section';
  text: MarkdownText;
  constructor(slackUserId: string, isPublic: boolean, status?: Status) {
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
  constructor(status?: Status) {
    const search = status ? `*${getStatusDisplay(status).toLowerCase()}* ` : '';
    const text = `Darn, we couldn't find any ${search}initiatives :thinking_face: ...  maybe you should add one! :muscle:
    :tada: */add-initiative [name], [optional description], [optional #channel]* :confetti_ball:`.replace(/  +/g, '');
    this.text = { type: 'mrkdwn', text };
  }
}
