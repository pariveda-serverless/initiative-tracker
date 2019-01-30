import { Initiative } from '../initiatives/initiative'
import { generateInitiativeDecisionButton } from './buttons'
import { Colors } from './colors';
import { generateField } from './fields'
import { Actions } from '../action-types'

export  function generateInitiativeAttachments(initiatives: Array<Initiative>) : any {
  let attachments = []
  initiatives.map((initiative)=> attachments.push(generateInitiativeAttachment(initiative)));
  return attachments;  
}

export function generateInitiativeAttachment(initiative: Initiative){
  return {
    text: initiative.name,
    style: Colors[`${initiative.status}`],
    "attachment_type": "default",
    "callback_id": Actions.JOIN_INITIATIVE,
    fields: [
      generateField('Creator', initiative.creator),
      generateField('Status', initiative.status)
    ],
    actions: [
      generateInitiativeDecisionButton('CHAMPION', initiative.id),
      generateInitiativeDecisionButton('JOIN', initiative.id),
    ]
  } 
}