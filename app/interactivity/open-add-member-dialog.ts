import { ActionPayload } from 'slack';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { sendDialogue } from '../slack-api';
import { AddMemberDialog } from '../slack-messages';
import { getQuery } from '../slash-commands/list-initiatives';

export async function openAddMemberDialogAction(
  teamId: string,
  channel: string,
  queryId: string,
  payload: ActionPayload,
  triggerId: string
): Promise<any> {
  const { initiativeId } = parseValue(payload.actions[0].selected_option.value);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  const query = await getQuery(queryId);
  const dialog = new AddMemberDialog(initiative, query, triggerId);
  await sendDialogue(teamId, dialog);
}
