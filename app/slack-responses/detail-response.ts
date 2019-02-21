import { Message, Section, DividerBlock, Action, ContextBlock } from 'slack';
import { InitiativeResponse } from '../initiative';
import {
  InitiativeNameStatusAndUpdateStatus,
  InitiativeDescription,
  Divider,
  CreatedBy,
  InitiativeDetailActions
} from './initiative-card';
import { NameAndRole, MemberActions } from './member-card';

export class DetailResponse implements Message {
  channel: string;
  blocks: (Section | DividerBlock | Action | ContextBlock)[];
  constructor(initiative: InitiativeResponse, slackUserId: string, channel?: string) {
    let blocks: (Section | DividerBlock | Action | ContextBlock)[] = [];
    this.channel = channel;
    const nameAndStatus = new InitiativeNameStatusAndUpdateStatus(initiative);
    const description = new InitiativeDescription(initiative);
    const metaInformation = new CreatedBy(initiative);
    const divider = new Divider();
    blocks = [nameAndStatus, description, metaInformation];

    // Only add the join buttons if the user isn't already a member
    if (!initiative.members.find(member => member.slackUserId === slackUserId)) {
      const initiativeActions = new InitiativeDetailActions(initiative);
      blocks.push(initiativeActions);
    }

    const members = initiative.members
      .sort(member => (member.champion ? -1 : 1))
      .map(member => {
        const nameAndRole = new NameAndRole(member);
        const memberActions = new MemberActions(member, initiative);
        return [nameAndRole, memberActions, divider];
      })
      .reduce((all, block) => all.concat(block), []);
    // Remove the last divider block
    this.blocks = [...blocks, divider, ...members].slice(0, -1);
  }
}
