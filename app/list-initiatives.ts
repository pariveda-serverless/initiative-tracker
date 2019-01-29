import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { getInitiatives } from './initiatives/initiative.service'
import { generateInitiativeMessage } from './slack-components/initiative-message'  
import { Initiative } from './initiatives/initiative'

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {

    // CLEANUP THIS CODE PLEASE
    const initiatives = await getInitiatives();
    console.log('INITIATIVES', initiatives);
    let initiativeList: Array<Initiative> = new Array<Initiative>();
    const cachedInitiatives: any = new Object();
    // Getting map of partition key to initiative
    initiatives.map((initiative)=> cachedInitiatives[initiative.partitionKey] = new Initiative(initiative))
    console.log('cachedInitiatives', cachedInitiatives)
    // Storing names of each initiative in array
    for (const partitionKey in cachedInitiatives) {
      console.log('EVALUATING', partitionKey);
      console.log('INITIATIVE = ', cachedInitiatives[partitionKey]);
      initiativeList.push(cachedInitiatives[partitionKey].name)
    }
    
    const message = generateInitiativeMessage(initiatives);

    console.log('Message is ', JSON.stringify(message));
    success(message);
  } catch (err) {
    error(err);
  }
});
