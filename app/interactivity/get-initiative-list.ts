import { ActionPayload, Message } from 'slack';
import { ListResponse } from '../slack-messages';
import { getInitiatives, saveQuery } from '../slash-commands/list-initiatives';
import { Query, CreateQueryRequest } from '../queries';
import { parseValue } from './id-helper';
import { table } from '../shared';
import { Status } from '../initiatives';
import { ListAction } from './interactions';
import { Profile, getAndSaveUserProfile } from '../slack-api';

export async function getInitiativeListAction(
  teamId: string,
  channelId: string,
  payload: ActionPayload,
  profile: Profile
): Promise<Message> {
  const slackUserId = payload.user.id;
  const query = await getOrCreateQuery(payload, profile);
  const initiatives = await getInitiatives(teamId);
  return new ListResponse({ initiatives, channelId, slackUserId, query });
}

async function getOrCreateQuery(payload: ActionPayload, profile: Profile): Promise<Query> {
  let status: Status, office: string, statusChanged: boolean, officeChanged: boolean, queryId: string;
  if (payload.actions && payload.actions.length > 0 && payload.actions[0].selected_option) {
    const action = payload.actions[0];
    statusChanged = action.action_id === ListAction.FILTER_BY_STATUS;
    officeChanged = action.action_id === ListAction.FILTER_BY_OFFICE;
    ({ status, office, queryId } = parseValue(action.selected_option.value));
  }
  let query;
  if (queryId) {
    const existing = await getQuery(queryId);
    query = await saveQuery(existing.getUpdateRequest({ status, office, statusChanged, officeChanged }));
  } else {
    office = office || profile.office;
    status = status || Status.ACTIVE;
    const queryRequest = new CreateQueryRequest({ status, office });
    query = await saveQuery(queryRequest);
  }
  return query;
}

async function getQuery(queryId: string): Promise<Query> {
  const params = { TableName: process.env.QUERIES_TABLE, Key: { queryId } };
  console.log('Getting query with params', params);
  return await table
    .get(params)
    .promise()
    .then(res => new Query(res.Item));
}
