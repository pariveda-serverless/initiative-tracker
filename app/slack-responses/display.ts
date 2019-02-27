import { Status } from '../initiative';
import { InitiativeAction, StatusUpdateAction } from '../interactions';

export const YELLOW = '#FCF500';
export const PINK = '#FF1C7D';
export const GREEN = '#83DE00';
export const ORANGE = '#FF7F0D';
export const PURPLE = '#CC38CE';
export const BLACK = '#000000';

const statuses: Display[] = [];
statuses[Status.ACTIVE] = <Display>{ text: 'Active' };
statuses[Status.COMPLETE] = <Display>{ text: 'Complete' };
statuses[Status.ABANDONED] = <Display>{ text: 'Abandoned' };
statuses[Status.ON_HOLD] = <Display>{ text: 'On hold' };

const initiativeActions: Display[] = [];
initiativeActions[InitiativeAction.JOIN_AS_CHAMPION] = <Display>{
  text: 'Champion initiative'
};
initiativeActions[InitiativeAction.JOIN_AS_MEMBER] = <Display>{
  text: 'Join initiative'
};
initiativeActions[InitiativeAction.UPDATE_STATUS] = <Display>{
  text: 'Update status'
};
initiativeActions[InitiativeAction.VIEW_DETAILS] = <Display>{
  text: 'View details'
};

const statusUpdateIntents: Display[] = [];
statusUpdateIntents[StatusUpdateAction.MARK_ABANDONED] = <Display>{
  text: `Not being worked on`
};
statusUpdateIntents[StatusUpdateAction.MARK_COMPLETE] = <Display>{
  text: `Completed`
};
statusUpdateIntents[StatusUpdateAction.MARK_ACTIVE] = <Display>{
  text: `Actively being worked on`
};
statusUpdateIntents[StatusUpdateAction.MARK_ON_HOLD] = <Display>{
  text: `On hold`
};

interface Display {
  text: string;
}

export const STATUS_DISPLAY: Display[] = statuses;
export const INITIATIVE_ACTION_DISPLAY: Display[] = initiativeActions;
export const STATUS_UPDATE_DISPLAY: Display[] = statusUpdateIntents;
