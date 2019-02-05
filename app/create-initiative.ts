import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { post } from 'request-promise';
import { Status } from './initiatives/status'
import { Initiative } from './initiatives/initiative'
import { saveInitiative } from './initiatives/initiative.service'

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    console.log('Body', body);
    console.log('Response url', body.response_url);

    const initiative = new Initiative({
      name: body.text,
      creator: body.user_id,
      status: Status.WIP
    });

    await saveInitiative(initiative);

    // TODO: Use slack component templates, separate the UI from the backend
    const message = {
      text: `${body.user_name} has created initiative:`,
      attachments: [
        // TODO: PUT INITIATIVE SLACK ATTACHMENTS
        {
          text: `${body.text}`,
        }
      ],
      response_type: 'in_channel'
    };

    success(message);
  } catch (err) {
    error(err);
  }
});
