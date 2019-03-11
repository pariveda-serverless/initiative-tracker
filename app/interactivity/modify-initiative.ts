// import { ActionPayload, Message } from 'slack';
// import { parseValue } from './id-helper';
// import { DeleteResponse, EditInitiativeDialog } from '../slack-messages';
// import { getInitiativeDetails } from './get-initiative-details';
// import { sendDialogue } from '../slack-api';
// import { getTeamIdentifier } from '../members';
// import { initiativesTable } from '../shared';
// import { InitiativeRecord, InitiativeResponse, INITIATIVE_TYPE } from '../initiatives';
// import { InitiativeAction } from './interactions';

// export async function modifyInitiativeAction(
//   teamId: string,
//   channel: string,
//   payload: ActionPayload,
//   triggerId: string
// ): Promise<Message> {
//   let response: Message;
//   switch (action) {
//     case InitiativeAction.DELETE: {
//       const name = await deleteInitiative(teamId, initiativeId);
//       response = new DeleteResponse(channel, name);
//       break;
//     }
//     case InitiativeAction.OPEN_EDIT_DIALOG: {
//       break;
//     }
//   }
//   return response;
// }
