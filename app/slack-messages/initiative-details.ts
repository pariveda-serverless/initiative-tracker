import { Message, Section, DividerBlock, Action, ContextBlock } from 'slack';
import { InitiativeResponse } from '../initiatives';
import {
  Divider,
  CreatedBy,
  InitiativeDetailActions,
  InitiativeInformationAndUpdateActions,
  MemberSection
} from './shared-messages';

export class DetailResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiative: InitiativeResponse, slackUserId: string, channel?: string) {
    this.channel = channel;
    const divider = new Divider();

    let blocks: (Section | DividerBlock | Action | ContextBlock)[] = [];
    const nameAndStatus = new InitiativeInformationAndUpdateActions(initiative);
    blocks.push(nameAndStatus);

    const metaInformation = new CreatedBy(initiative);
    blocks.push(metaInformation);

    // Only add the join buttons if the user isn't already a member
    if (!initiative.members.find(member => member.slackUserId === slackUserId)) {
      const initiativeActions = new InitiativeDetailActions(initiative);
      blocks.push(initiativeActions);
    }

    const members = initiative.members
      .sort(member => (member.champion ? -1 : 1))
      .map(member => {
        const memberSection = new MemberSection(member, initiative);
        return [memberSection, divider];
      })
      .reduce((all, block) => all.concat(block), []);
    // Remove the last divider block
    this.blocks = [...blocks, divider, ...members].slice(0, -1);
  }
}
