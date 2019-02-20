import { Status } from '../status';
import { InitiativeListAction, InitiativeDetailAction, MemberAction, StatusUpdateAction } from '../interactions';

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

const initiativeActions: ActionDisplay[] = [];
initiativeActions[InitiativeDetailAction.JOIN_AS_CHAMPION] = <ActionDisplay>{
  text: 'Champion this initiative'
};
initiativeActions[InitiativeDetailAction.JOIN_AS_MEMBER] = <ActionDisplay>{
  text: 'Join this initiative'
};
initiativeActions[InitiativeDetailAction.UPDATE_STATUS] = <ActionDisplay>{
  text: 'Update status'
};
initiativeActions[InitiativeListAction.JOIN_AS_CHAMPION] = <ActionDisplay>{
  text: 'Champion this initiative'
};
initiativeActions[InitiativeListAction.JOIN_AS_MEMBER] = <ActionDisplay>{
  text: 'Join this initiative'
};
initiativeActions[InitiativeListAction.VIEW_DETAILS] = <ActionDisplay>{
  text: 'View initiative details'
};

const memberActions: ActionDisplay[] = [];
memberActions[MemberAction.REMOVE_MEMBER] = <ActionDisplay>{
  text: 'Remove from initiative',
  confirmation: { title: 'Confirm removal', verb: 'remove', noun: 'from the initiative' }
};
memberActions[MemberAction.MAKE_CHAMPION] = <ActionDisplay>{
  text: 'Make champion',
  confirmation: { title: 'Confirm change', verb: 'make', noun: 'an initiative champion' }
};
memberActions[MemberAction.MAKE_MEMBER] = <ActionDisplay>{
  text: 'Make member',
  confirmation: { title: 'Confirm change', verb: 'make', noun: 'an initiative member instead of champion' }
};

const statusUpdateIntents: ActionDisplay[] = [];
statusUpdateIntents[StatusUpdateAction.MARK_ABANDONED] = <ActionDisplay>{
  text: `Not being worked on`,
  status: Status.ABANDONED
};
statusUpdateIntents[StatusUpdateAction.MARK_COMPLETE] = <ActionDisplay>{
  text: `Completed`,
  status: Status.COMPLETE
};
statusUpdateIntents[StatusUpdateAction.MARK_ACTIVE] = <ActionDisplay>{
  text: `Actively being worked on`,
  status: Status.ACTIVE
};
statusUpdateIntents[StatusUpdateAction.MARK_ON_HOLD] = <ActionDisplay>{
  text: `On hold`,
  status: Status.ON_HOLD
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

interface ActionDisplay {
  text: string;
  confirmation?: ConfirmationDisplay;
}

interface ConfirmationDisplay {
  title: string;
  verb: string;
  noun: string;
}

export const STATUS_DISPLAY: StatusDisplay[] = statuses;
export const INITIATIVE_ACTION_DISPLAY: ActionDisplay[] = initiativeActions;
export const MEMBER_ACTION_DISPLAY: ActionDisplay[] = memberActions;
export const STATUS_UPDATE_DISPLAY: ActionDisplay[] = statusUpdateIntents;
export const MEMBER_DISPLAY: MemberDisplay[] = members;
