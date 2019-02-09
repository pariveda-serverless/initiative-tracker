import { WebClient, WebAPICallResult } from '@slack/client';

const slack = new WebClient(process.env.SLACK_ACCESS_TOKEN);

export async function getUserName(user: string): Promise<string> {
  const result = await slack.users.profile.get({ user }).then(raw => {
    console.log(raw);
    return raw as ProfileResult;
  });
  return result.profile.real_name;
}

interface ProfileResult extends WebAPICallResult {
  profile: Profile;
}

interface Profile {
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
