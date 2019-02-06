import { Status } from '../status';
import { Intent } from '../interactions';

let statuses: Display[] = [];
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

let intents: Display[] = [];
intents[Intent.JOIN_AS_CHAMPION] = {
  color: 'primary',
  text: 'Champion this initiative'
};
intents[Intent.JOIN_AS_MEMBER] = {
  color: 'default',
  text: 'Join this initiative'
};

interface Display {
  color: string;
  text: string;
}

export const STATUS_DISPLAY = statuses;
export const INTENT_DISPLAY = intents;
