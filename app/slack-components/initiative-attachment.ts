import { Initiative } from '../initiatives/initiative'
import { generateInitiativeDecisionButton } from './buttons'
import { Colors } from './colors';

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
    actions: [
      generateInitiativeDecisionButton('CHAMPION', initiative.id),
      generateInitiativeDecisionButton('JOIN', initiative.id),
    ]
  } 
}