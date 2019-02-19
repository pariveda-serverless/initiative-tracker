import { WebClient } from '@slack/client';
import { StatusUpdateRequest } from '../slack-responses/status-update-request';

const slack = new WebClient(process.env.SLACK_ACCESS_TOKEN);

export async function requestStatusUpdate(statusUpdateRequest: StatusUpdateRequest): Promise<any> {
  const response = await slack.chat.postMessage(
    statusUpdateRequest
    //   {
    //   channel: member.slackUserId,
    //   text: 'What is the status of this initiative?',
    //   attachments: [statusUpdateRequest]
    // }
  );
  console.log(response);
  return response;
}
