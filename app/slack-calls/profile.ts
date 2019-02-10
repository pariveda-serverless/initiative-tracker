import { WebClient, WebAPICallResult } from '@slack/client';

const slack = new WebClient(process.env.SLACK_ACCESS_TOKEN);

export async function getUserProfile(user: string): Promise<Profile> {
  const profile = await slack.users.profile
    .get({ user })
    .then(raw => raw as ProfileResult)
    .then(result => result.profile);
  console.log('Received profile result from Slack', profile);
  return { name: profile.real_name_normalized, icon: profile.image_original };
}

interface Profile {
  name: string;
  icon: string;
}

interface ProfileResult extends WebAPICallResult {
  profile: SlackProfile;
}

interface SlackProfile {
  avatar_hash: string;
  status_text: string;
  status_emoji: string;
  real_name: string;
  display_name: string;
  real_name_normalized: string;
  display_name_normalized: string;
  email: string;
  image_original: string;
  team: string;
}
