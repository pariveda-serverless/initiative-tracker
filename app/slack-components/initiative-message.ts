import { Initiative } from '../initiatives/initiative'
import { generateInitiativeAttachments } from './initiative-attachment'

export function generateInitiativeMessage(initiatives: Array<Initiative>) {
  return {
    text: 'Initiative registration',
    attachments: generateInitiativeAttachments(initiatives),
    response_type: 'in_channel'
  }
}