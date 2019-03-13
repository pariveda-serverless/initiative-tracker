import { WebClient, WebAPICallResult } from '@slack/client';
import { getParsedChannel } from '../slash-commands/add-initiative';
import { getToken } from '../app-authorization';

const slack = new WebClient();

export async function getChannelInfo(channelId: string, teamId: string): Promise<Channel> {
  console.log('Getting channel information', channelId);
  const token = await getToken(teamId);
  const channel = await slack.channels
    .info({ channel: channelId, token, include_labels: true })
    .then(raw => raw as ChannelResult)
    .then(result => result.channel);
  console.log('Received channel result from Slack', channel);
  return { id: channel.id, name: channel.name, parsed: getParsedChannel(channel.id, channel.name) };
}

interface Channel {
  id: string;
  name: string;
  parsed: string;
}

interface ChannelResult extends WebAPICallResult {
  channel: SlackChannel;
}

interface SlackChannel {
  id: string;
  name: string;
}
