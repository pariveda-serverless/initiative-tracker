import { WebClient, WebAPICallResult } from '@slack/client';
import { SSM } from 'aws-sdk';
import { getAccessTokenParameterPath } from '../../app-authorization/auth-redirect';
import { getParsedChannel } from '../../slash-commands/add-initiative';

const slack = new WebClient();
const ssm = new SSM({ apiVersion: '2014-11-06' });

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

async function getToken(teamId: string): Promise<string> {
  const params = {
    Name: getAccessTokenParameterPath(teamId),
    WithDecryption: true
  };
  console.log('Getting access token with params', params);
  return ssm
    .getParameter(params)
    .promise()
    .then(res => res.Parameter.Value);
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
