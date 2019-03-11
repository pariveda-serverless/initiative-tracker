// import { MemberAction } from './interactions';
// import { ActionPayload, Message } from 'slack';
// import { parseValue } from './id-helper';
// import { getInitiativeDetails } from './get-initiative-details';
// import { DetailResponse } from '../slack-messages';
// import { getMemberIdentifiers, DeleteMemberRequest } from '../members';
// import { initiativesTable } from '../shared';

// export async function modifyMemberAction(teamId: string, channel: string, payload: ActionPayload): Promise<Message> {
//   const { initiativeId, slackUserId, action } = parseValue(payload.actions[0].selected_option.value);
//   switch (action) {
//     case MemberAction.REMOVE_MEMBER: {
//       await leaveInitiative(initiativeId, teamId, slackUserId);
//       break;
//     }
//     case MemberAction.MAKE_CHAMPION: {
//       await changeMembership(initiativeId, teamId, slackUserId, true);
//       break;
//     }
//     case MemberAction.MAKE_MEMBER: {
//       await changeMembership(initiativeId, teamId, slackUserId, false);
//       break;
//     }
//   }
//   const initiative = await getInitiativeDetails(teamId, initiativeId);
//   return new DetailResponse(initiative, slackUserId, channel);
// }

// async function changeMembership(
//   initiativeId: string,
//   teamId: string,
//   slackUserId: string,
//   champion: boolean
// ): Promise<any> {
//   const params = {
//     TableName: process.env.INITIATIVES_TABLE,
//     Key: { initiativeId, identifiers: getMemberIdentifiers(teamId, slackUserId) },
//     UpdateExpression: 'set #champion = :champion',
//     ExpressionAttributeNames: { '#champion': 'champion' },
//     ExpressionAttributeValues: { ':champion': champion }
//   };
//   console.log('Updating membership type with params', params);
//   await initiativesTable.update(params).promise();
// }

// function leaveInitiative(initiativeId: string, teamId: string, slackUserId: string): Promise<any> {
//   const Key = new DeleteMemberRequest({ initiativeId, teamId, slackUserId });
//   const params = { TableName: process.env.INITIATIVES_TABLE, Key };
//   console.log('Removing member from initiative with params', params);
//   return initiativesTable.delete(params).promise();
// }
