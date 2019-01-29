import { Initiative } from '../initiatives/initiative'
import { generateInitiativeDecisionButton } from './buttons'

export  function generateInitiativeAttachments(initiatives: Array<Initiative>) : any {
  let attachments = []
  initiatives.map((initiative)=> attachments.push(generateInitiativeAttachment(initiative)));
  return attachments;  
}

export function generateInitiativeAttachment(initiative: Initiative){
  return {
    text: initiative.name,
    actions: [
      generateInitiativeDecisionButton('CHAMPION', initiative.id),
      generateInitiativeDecisionButton('JOIN', initiative.id),
    ]
  } 
}