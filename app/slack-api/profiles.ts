import { WebClient, WebAPICallResult } from '@slack/web-api';
import { getToken } from '../app-authorization';
import { CreateUserRequest, User } from '../users';
import { table } from '../shared';

const slack = new WebClient();

export async function getAndSaveUserProfile(slackUserId: string, teamId: string): Promise<User> {
  try {
    return await getCachedUserProfile(slackUserId);
  } catch (err) {
    const profile = await getUserProfile(slackUserId, teamId);
    await saveUserInformation(profile);
    return profile;
  }
}

async function getCachedUserProfile(slackUserId: string): Promise<User> {
  const params = { TableName: process.env.USERS_TABLE, Key: { slackUserId } };
  console.log('Getting user with params', params);
  return table
    .get(params)
    .promise()
    .then(res => new User(res.Item));
}

async function getUserProfile(user: string, teamId: string): Promise<Profile> {
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
    office: getOffice(profile),
    teamId: teamId
  };
}

async function saveUserInformation(profile: Profile): Promise<any> {
  const user = new CreateUserRequest(profile);
  const params = { TableName: process.env.USERS_TABLE, Item: user };
  console.log('Saving user with params', params);
  await table.put(params).promise();
}

function getOffice(profile: SlackProfile): string {
  const office = profile.fields && Object.values(profile.fields).find(field => field.label.toUpperCase() === 'OFFICE');
  return office && office.value;
}

export interface Profile {
  name: string;
  icon: string;
  slackUserId: string;
  office?: string;
  teamId: string;
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
