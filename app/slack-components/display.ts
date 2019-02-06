import { Status } from '../status';
import { Intent } from '../interactions';

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

const intents: Display[] = [];
intents[Intent.JOIN_AS_CHAMPION] = {
  style: 'default',
  text: 'Champion this initiative'
};
intents[Intent.JOIN_AS_MEMBER] = {
  style: 'default',
  text: 'Join this initiative'
};
intents[Intent.VIEW_DETAILS] = {
  style: 'default',
  text: 'View initiative details'
};

const members: Display[] = [];
members['CHAMPION'] = {
  color: '#85DB18', // Green
  text: 'Champion'
};
members['MEMBER'] = {
  color: '#00FEFF', // Blue
  text: 'Member'
};

interface Display {
  style: string;
  text: string;
}

export const STATUS_DISPLAY: Display[] = statuses;
export const INTENT_DISPLAY: Display[] = intents;
export const MEMBER_DISPLAY: Display[] = members;
