import { ActionPayload } from 'slack';
import { EditInitiativeDialog } from '../slack-messages';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { sendDialogue } from '../slack-api';
import { getQuery } from '../slash-commands/list-initiatives';

export async function openEditDialogAction(
  teamId: string,
  channel: string,
  queryId: string,
  payload: ActionPayload,
  triggerId: string,
  responseUrl: string
): Promise<any> {
  const query = await getQuery(queryId);
  const { initiativeId } = parseValue(payload.actions[0].selected_option.value);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  const dialog = new EditInitiativeDialog(initiative, query, triggerId, responseUrl);
  await sendDialogue(teamId, dialog);
}
