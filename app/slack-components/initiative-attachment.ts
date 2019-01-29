import { Initiative } from '../initiatives/initiative'
import { generateInitiativeDecisionButton } from './buttons'
import { Colors } from './colors';
import { generateField } from './fields'

export  function generateInitiativeAttachments(initiatives: Array<Initiative>) : any {
  let attachments = []
  initiatives.map((initiative)=> attachments.push(generateInitiativeAttachment(initiative)));
  return attachments;  
}

export function generateInitiativeAttachment(initiative: Initiative){
  return {
    text: initiative.name,
    color: Colors[`${initiative.status}`],
    "attachment_type": "default",
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