import { ActionPayload } from 'slack';
import { EditInitiativeDialog } from '../slack-messages';
import { parseValue } from './id-helper';
import { getInitiativeDetails } from './get-initiative-details';
import { sendDialogue } from '../slack-api';

export async function openEditDialogAction(
  teamId: string,
  channel: string,
  payload: ActionPayload,
  triggerId: string
): Promise<any> {
  const { initiativeId } = parseValue(payload.actions[0].selected_option.value);
  const initiative = await getInitiativeDetails(teamId, initiativeId);
  const dialog = new EditInitiativeDialog(initiative, triggerId);
  await sendDialogue(teamId, dialog);
}
