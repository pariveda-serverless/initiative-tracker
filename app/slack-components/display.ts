import { Status } from '../status';
import { InitiativeIntent, MemberIntent } from '../interactions';

const YELLOW = '#FCF500';
const PINK = '#FF1C7D';
const GREEN = '#83DE00';
const ORANGE = '#FF7F0D';
const PURPLE = '#CC38CE';
const BLACK = '#000000';

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
  text: 'Change to champion',
  confirmation: { title: 'Confirm change', verb: 'set', action: 'as an initiative champion' }
};
memberIntents[MemberIntent.MAKE_MEMBER] = <IntentDisplay>{
  style: 'default',
  text: 'Change to member',
  confirmation: { title: 'Confirm change', verb: 'set', action: 'as an initiative member instead of a champion' }
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
export const MEMBER_DISPLAY: MemberDisplay[] = members;
