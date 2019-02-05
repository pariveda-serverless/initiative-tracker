import { InitiativeResponse } from '../initiative';
import { generateInitiativeDecisionButton } from './buttons';
import { Colors } from './colors';
import { generateField } from './fields';
import { Actions } from '../action-types';

export function generateInitiativeAttachments(initiatives: InitiativeResponse[]): any {
  let attachments = [];
  initiatives.map(initiative => attachments.push(generateInitiativeAttachment(initiative)));
  return attachments;
}

export function generateInitiativeAttachment(initiative: InitiativeResponse) {
  return {
    text: initiative.name,
    style: Colors[`${initiative.status}`],
    attachment_type: 'default',
    callback_id: Actions.JOIN_INITIATIVE,
    fields: [generateField('Status', initiative.status)],
    actions: [
      generateInitiativeDecisionButton('CHAMPION', initiative.initiativeId),
      generateInitiativeDecisionButton('JOIN', initiative.initiativeId)
    ]
  };
}
