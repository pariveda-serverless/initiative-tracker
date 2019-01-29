import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { getInitiatives } from './initiatives/initiative.service'

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {

    const initiatives = await getInitiatives();
    console.log('INITIATIVES', initiatives);
    let initiativeNamesList: Array<String> = new Array();
    const cachedInitiatives: any = new Object();
    // Getting map of partition key to initiative
    initiatives.map((initiative)=> cachedInitiatives[initiative.partitionKey] = initiative)
    console.log('cachedInitiatives', cachedInitiatives)
    // Storing names of each initiative in array
    for (const partitionKey in cachedInitiatives) {
      console.log('EVALUATING', partitionKey);
      console.log('INITIATIVE = ', cachedInitiatives[partitionKey]);
      if (cachedInitiatives[partitionKey].name){
        initiativeNamesList.push(cachedInitiatives[partitionKey].name)
      }
    }
    const message = {
      text: 'Initiative registration',
      attachments: generateAttachments(initiativeNamesList),
      response_type: 'in_channel'
    };

    console.log('Message is ', message);
    success(message);
  } catch (err) {
    error(err);
  }
});


function generateAttachments(list) : Array<any> {
  let attachemnts = [];
  for (const item of list){
    console.log('ITEM', item);
    attachemnts.push(generateAttacment(item))
  }
  return attachemnts;
}
function generateAttacment(text: String) : any {
  return {
    "fallback": "Required plain-text summary of the attachment.",
    "color": randomHexColor(),
    "text": text
  }
}
function randomHexColor(): String {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}