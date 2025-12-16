import { StatusCount, StatusType } from '@app-types/screens';
import { STATUS } from './app.constant';

export interface StatusFilterItem {
  key: StatusType;
  label: string;
  count: number;
}

export const getStatusItems = (
  statusCounts: StatusCount,
): StatusFilterItem[] => [
  {
    key: STATUS.NOT_ENROLLED,
    label: 'participants.notEnrolled',
    count: statusCounts['Not Onboarded'],
  },
  {
    key: STATUS.ENROLLED,
    label: 'participants.enrolled',
    count: statusCounts['Onboarded'],
  },
  {
    key: STATUS.IN_PROGRESS,
    label: 'participants.inProgress',
    count: statusCounts['In Progress'],
  },
  {
    key: STATUS.COMPLETED,
    label: 'participants.completed',
    count: statusCounts['Completed'],
  },
  {
    key: STATUS.GRADUATED,
    label: 'participants.graduatedStatus',
    count: statusCounts['Graduated'],
  },
  {
    key: STATUS.DROPOUT,
    label: 'participants.droppedOut',
    count: statusCounts['Dropped out'],
  },
];
