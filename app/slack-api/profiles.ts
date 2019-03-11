import { WebClient, WebAPICallResult } from '@slack/client';
import { getToken } from '../app-authorization';

const slack = new WebClient();

export async function getUserProfile(user: string, teamId: string): Promise<Profile> {
  console.log('Getting user profile information', user);
  const token = await getToken(teamId);
  const profile = await slack.users.profile
    .get({ user, token, include_labels: true })
    .then(raw => raw as ProfileResult)
    .then(result => result.profile);
  console.log('Received profile result from Slack', profile);
  return {
    name: profile.real_name_normalized,
    icon: profile.image_original ? profile.image_original : profile.image_512,
    slackUserId: user,
    office: getOffice(profile)
  };
}

function getOffice(profile: SlackProfile): string {
  const office = profile.fields && Object.values(profile.fields).find(field => field.label.toUpperCase() === 'OFFICE');
  return office && office.value;
}

interface Profile {
  name: string;
  icon: string;
  slackUserId: string;
  office?: string;
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
  fields: {
    [key: string]: {
      value: string;
      alt: string;
      label: string;
    };
  };
  image_original: string;
  image_512: string;
  team: string;
}