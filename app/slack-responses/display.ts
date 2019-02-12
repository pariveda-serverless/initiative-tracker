import { Status } from '../status';
import { InitiativeIntent, MemberIntent, StatusUpdateIntent } from '../interactions';

export const YELLOW = '#FCF500';
export const PINK = '#FF1C7D';
export const GREEN = '#83DE00';
export const ORANGE = '#FF7F0D';
export const PURPLE = '#CC38CE';
export const BLACK = '#000000';

const statuses: StatusDisplay[] = [];
statuses[Status.ACTIVE] = <StatusDisplay>{ color: GREEN, text: 'Active' };
statuses[Status.COMPLETE] = <StatusDisplay>{ color: BLACK, text: 'Complete' };
statuses[Status.ABANDONED] = <StatusDisplay>{ color: PINK, text: 'Abandoned' };
statuses[Status.ON_HOLD] = <StatusDisplay>{ color: ORANGE, text: 'On hold' };

const initiativeIntents: IntentDisplay[] = [];
initiativeIntents[InitiativeIntent.JOIN_AS_CHAMPION] = <IntentDisplay>{
  style: 'default',
  text: 'Champion this initiative'
};
initiativeIntents[InitiativeIntent.JOIN_AS_MEMBER] = <IntentDisplay>{
  style: 'default',
  text: 'Join this initiative'
};
initiativeIntents[InitiativeIntent.VIEW_DETAILS] = <IntentDisplay>{
  style: 'default',
  text: 'View initiative details'
};

const memberIntents: IntentDisplay[] = [];
memberIntents[MemberIntent.REMOVE_MEMBER] = <IntentDisplay>{
  style: 'danger',
  text: 'Remove from initiative',
  confirmation: { title: 'Confirm removal', verb: 'remove', action: 'from the initiative' }
};
memberIntents[MemberIntent.MAKE_CHAMPION] = <IntentDisplay>{
  style: 'default',
  text: 'Make champion',
  confirmation: { title: 'Confirm change', verb: 'make', action: 'an initiative champion' }
};
memberIntents[MemberIntent.MAKE_MEMBER] = <IntentDisplay>{
  style: 'default',
  text: 'Make member',
  confirmation: { title: 'Confirm change', verb: 'make', action: 'an initiative member instead of champion' }
};

const statusUpdateIntents: IntentDisplay[] = [];
statusUpdateIntents[StatusUpdateIntent.MARK_ABANDONED] = <IntentDisplay>{
  style: 'default',
  text: `Not being worked on`
};
statusUpdateIntents[StatusUpdateIntent.MARK_COMPLETE] = <IntentDisplay>{
  style: 'default',
  text: `Completed`
};
statusUpdateIntents[StatusUpdateIntent.MARK_ACTIVE] = <IntentDisplay>{
  style: 'default',
  text: `Actively being worked on`
};
statusUpdateIntents[StatusUpdateIntent.MARK_ON_HOLD] = <IntentDisplay>{
  style: 'default',
  text: `On hold`
};

const members: MemberDisplay[] = [];
members['CHAMPION'] = <MemberDisplay>{ color: PURPLE, text: 'Champion' };
members['MEMBER'] = <MemberDisplay>{ color: '', text: 'Member' };

interface StatusDisplay {
  color: string;
  text: string;
}

interface MemberDisplay {
  color: string;
  text: string;
}

interface IntentDisplay {
  style: 'default' | 'danger' | 'primary';
  text: string;
  confirmation?: ConfirmationDisplay;
}

interface ConfirmationDisplay {
  title: string;
  verb: string;
  action: string;
}

export const STATUS_DISPLAY: StatusDisplay[] = statuses;
export const INITIATIVE_INTENT_DISPLAY: IntentDisplay[] = initiativeIntents;
export const MEMBER_INTENT_DISPLAY: IntentDisplay[] = memberIntents;
export const STATUS_UPDATE_DISPLAY: IntentDisplay[] = statusUpdateIntents;
export const MEMBER_DISPLAY: MemberDisplay[] = members;
