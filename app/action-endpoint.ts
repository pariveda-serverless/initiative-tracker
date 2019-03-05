import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Message, ActionPayload } from 'slack';
import { InitiativeCallbackAction, InitiativeAction, MemberAction, StatusUpdateAction } from './interactions';
import {
  CreateMemberRequest,
  MEMBER_TYPE,
  MemberResponse,
  DeleteMemberRequest,
  getTeamIdentifier,
  getMemberIdentifiers
} from './member';
import { INITIATIVE_TYPE, InitiativeRecord, InitiativeResponse, Status, getInitiativeIdentifiers } from './initiative';
import {
  EditInitiativeDialogResponse,
  EditInitiativeFieldValidator
} from './slack-responses/edit-initiative-dialogue-response';
import { sendDialogue } from './slack/dialogues';
import { DetailResponse } from './slack-responses/initiative-details';
import { getUserProfile } from './slack/profile';
import { NotImplementedResponse } from './slack-responses/not-implemented';
import { reply } from './slack/messages';
import { parseValue } from './slack-responses/id-helper';
import { DeleteResponse } from './slack-responses/delete-initiative';

const initiatives = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    let response: Message | EditInitiativeDialogResponse | EditInitiativeFieldValidator;
    const { payload, teamId, responseUrl, channel, action, triggerId } = getFieldsFromBody(body);
    switch (action) {
      case InitiativeAction.JOIN_AS_MEMBER:
      case InitiativeAction.JOIN_AS_CHAMPION: {
        const { initiativeId, champion } = parseValue(payload.actions[0].value);
        const slackUserId = payload.user.id;
        await joinInitiative(teamId, initiativeId, slackUserId, champion);
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        await reply(responseUrl, response as Message);
        success();
        break;
      }
      // case InitiativeAction.DELETE: {
      //   const { initiativeId } = parseValue(payload.actions[0].value);
      //   break;
      // }
      case InitiativeAction.VIEW_DETAILS: {
        const { initiativeId } = parseValue(payload.actions[0].value);
        const slackUserId = payload.user.id;
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        await reply(responseUrl, response as Message);
        success();
        break;
      }
      // case InitiativeAction.OPEN_EDIT_DIALOG: {
      //   const { initiativeId } = parseValue(payload.actions[0].value);
      //   const initiative = await getInitiativeDetails(teamId, initiativeId);
      //   response = new EditInitiativeDialogResponse(initiative, triggerId);
      //   await sendDialogue(teamId, response);
      //   success();
      // }
      case InitiativeAction.UPDATE_INITIATIVE: {
        const { initiativeId, action } = parseValue(payload.actions[0].selected_option.value);
        switch (action) {
          case InitiativeAction.DELETE: {
            const name = await deleteInitiative(teamId, initiativeId);
            response = new DeleteResponse(channel, name);
            break;
          }
          case InitiativeAction.OPEN_EDIT_DIALOG: {
            const initiative = await getInitiativeDetails(teamId, initiativeId);
            response = new EditInitiativeDialogResponse(initiative, triggerId);
            await sendDialogue(teamId, response);
            success();
            break;
          }
        }
        break;
      }
      case MemberAction.UPDATE_ROLE: {
        const { initiativeId, slackUserId, action } = parseValue(payload.actions[0].selected_option.value);
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        switch (action) {
          case MemberAction.REMOVE_MEMBER: {
            await leaveInitiative(initiativeId, teamId, slackUserId);
            break;
          }
          case MemberAction.MAKE_CHAMPION: {
            await changeMembership(initiativeId, teamId, slackUserId, true);
            break;
          }
          case MemberAction.MAKE_MEMBER: {
            await changeMembership(initiativeId, teamId, slackUserId, false);
            break;
          }
        }
        response = new DetailResponse(initiative, slackUserId, channel);
        await reply(responseUrl, response as Message);
        success();
        break;
      }
      case InitiativeAction.UPDATE_STATUS:
      case StatusUpdateAction.MARK_ON_HOLD:
      case StatusUpdateAction.MARK_ABANDONED:
      case StatusUpdateAction.MARK_COMPLETE:
      case StatusUpdateAction.MARK_ACTIVE: {
        const value = payload.actions[0].value ? payload.actions[0].value : payload.actions[0].selected_option.value;
        const { initiativeId, status } = parseValue(value);
        const slackUserId = payload.user.id;
        await updateInitiativeStatus(initiativeId, teamId, status);
        const initiative = await getInitiativeDetails(teamId, initiativeId);
        response = new DetailResponse(initiative, slackUserId, channel);
        await reply(responseUrl, response as Message);
        success();
      }
      case InitiativeCallbackAction.EDIT_INITIATIVE_DIALOG: {
        const slackUserId = payload.user.id;
        const { initiative_name, initiative_description, initiative_status } = payload.submission;
        const { originalName, originalDescription, originalStatus, initiativeId } = JSON.parse(payload.state);
        const fieldValidator = new EditInitiativeFieldValidator(
          initiative_name,
          initiative_description,
          initiative_status,
          originalName,
          originalDescription,
          originalStatus
        );
        if (fieldValidator.errors.length > 0) {
          response = fieldValidator;
          success(response);
        } else {
          await updateInitiative(teamId, initiativeId, initiative_name, initiative_description, initiative_status);
          const initiative = await getInitiativeDetails(teamId, initiativeId);
          response = new DetailResponse(initiative, slackUserId, channel);
          await reply(responseUrl, response as Message);
          success();
        }
        break;
      }
      default: {
        response = new NotImplementedResponse(channel);
        await reply(responseUrl, response as Message);
        success();
        break;
      }
    }
  } catch (err) {
    error(err);
  }
});

function getFieldsFromBody(body: any) {
  const payload: ActionPayload = JSON.parse(body.payload);
  const teamId = payload.team.id;
  const responseUrl = payload.response_url;
  const channel = payload.channel.id;
  const action = payload.actions ? payload.actions[0].action_id : payload.callback_id;
  const triggerId = payload.trigger_id;
  return { payload, teamId, responseUrl, channel, action, triggerId };
}

function updateInitiative(
  teamId: string,
  initiativeId: string,
  initiativeName: string,
  initiativeDescription: string,
  initiativeStatus: string
): Promise<any> {
  const UpdateExpression = 'set #name = :name, #description = :description, #status = :status';
  const ExpressionAttributeNames = { '#name': 'name', '#description': 'description', '#status': 'status' };
  const ExpressionAttributeValues = {
    ':name': initiativeName,
    ':description': initiativeDescription,
    ':status': initiativeStatus
  };
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getInitiativeIdentifiers(teamId) },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  };
  console.log('Updating Initiative Name and/or Description', params);
  return initiatives.update(params).promise();
}

async function updateInitiativeStatus(initiativeId: string, teamId: string, status: Status): Promise<any> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getInitiativeIdentifiers(teamId) },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status }
  };
  console.log('Updating initiative status with params', params);
  await initiatives.update(params).promise();
}

async function joinInitiative(
  teamId: string,
  initiativeId: string,
  slackUserId: string,
  champion: boolean
): Promise<any> {
  const { name, icon } = await getUserProfile(slackUserId, teamId);
  const member = new CreateMemberRequest({ teamId, initiativeId, slackUserId, name, champion, icon });
  const params = { TableName: process.env.INITIATIVES_TABLE, Item: member };
  console.log('Adding member to initiative with params', params);
  await initiatives.put(params).promise();
}

async function changeMembership(
  initiativeId: string,
  teamId: string,
  slackUserId: string,
  champion: boolean
): Promise<any> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    Key: { initiativeId, identifiers: getMemberIdentifiers(teamId, slackUserId) },
    UpdateExpression: 'set #champion = :champion',
    ExpressionAttributeNames: { '#champion': 'champion' },
    ExpressionAttributeValues: { ':champion': champion }
  };
  console.log('Updating membership type with params', params);
  await initiatives.update(params).promise();
}

async function deleteInitiative(teamId: string, initiativeId: string): Promise<string> {
  const queryParams = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId and begins_with(#identifiers, :identifiers)',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId', '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId, ':identifiers': getTeamIdentifier(teamId) }
  };
  console.log('Getting initiative details with params', queryParams);
  const records = await initiatives
    .query(queryParams)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  const initiative = new InitiativeResponse(records.find(record => record.type === INITIATIVE_TYPE));
  const deleteParams = { RequestItems: {} };
  deleteParams.RequestItems[process.env.INITIATIVES_TABLE] = records.map(record => {
    return {
      DeleteRequest: { Key: { initiativeId: record.initiativeId, identifiers: record.identifiers } }
    };
  });
  console.log('Deleting initiative with params', deleteParams);
  await initiatives.batchWrite(deleteParams).promise();
  return initiative ? initiative.name : '';
}

function leaveInitiative(initiativeId: string, teamId: string, slackUserId: string): Promise<any> {
  const Key = new DeleteMemberRequest({ initiativeId, teamId, slackUserId });
  const params = { TableName: process.env.INITIATIVES_TABLE, Key };
  console.log('Removing member from initiative with params', params);
  return initiatives.delete(params).promise();
}

async function getInitiativeDetails(teamId: string, initiativeId: string): Promise<InitiativeResponse> {
  const params = {
    TableName: process.env.INITIATIVES_TABLE,
    KeyConditionExpression: '#initiativeId = :initiativeId and begins_with(#identifiers, :identifiers)',
    ExpressionAttributeNames: { '#initiativeId': 'initiativeId', '#identifiers': 'identifiers' },
    ExpressionAttributeValues: { ':initiativeId': initiativeId, ':identifiers': getTeamIdentifier(teamId) }
  };
  console.log('Getting initiative details with params', params);
  const records = await initiatives
    .query(params)
    .promise()
    .then(res => <InitiativeRecord[]>res.Items);
  console.log('Received initiative records', records);
  let initiative: InitiativeResponse = new InitiativeResponse(records.find(record => record.type === INITIATIVE_TYPE));
  initiative.members = records.filter(record => record.type === MEMBER_TYPE).map(record => new MemberResponse(record));
  return initiative;
}
