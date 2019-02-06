import { Status } from '../status';
import { InitiativeIntent, MemberIntent } from '../interactions';

const statuses: Display[] = [];
statuses[Status.ACTIVE] = {
  color: '#85DB18', // Green
  text: 'Active'
};
statuses[Status.COMPLETE] = {
  color: '#000000', // Black
  text: 'Complete'
};
statuses[Status.ABANDONED] = {
  color: '#FF4300', // Pink
  text: 'Abandoned'
};
statuses[Status.ON_HOLD] = {
  color: '#00FEFF', // Blue
  text: 'On hold'
};

const initiativeIntents: Display[] = [];
initiativeIntents[InitiativeIntent.JOIN_AS_CHAMPION] = {
  style: 'default',
  text: 'Champion this initiative'
};
initiativeIntents[InitiativeIntent.JOIN_AS_MEMBER] = {
  style: 'default',
  text: 'Join this initiative'
};
initiativeIntents[InitiativeIntent.VIEW_DETAILS] = {
  style: 'default',
  text: 'View initiative details'
};

const memberIntents: Display[] = [];
memberIntents[MemberIntent.REMOVE_MEMBER] = {
  style: 'danger',
  text: 'Remove member from initiative'
};

const members: Display[] = [];
members['CHAMPION'] = {
  color: '#FCF500', // Yellow
  text: 'Champion'
};
members['MEMBER'] = {
  color: '', // Blue
  text: 'Member'
};

interface Display {
  style: string;
  text: string;
}

export const STATUS_DISPLAY: Display[] = statuses;
export const INITIATIVE_INTENT_DISPLAY: Display[] = initiativeIntents;
export const MEMBER_INTENT_DISPLAY: Display[] = memberIntents;
export const MEMBER_DISPLAY: Display[] = members;
