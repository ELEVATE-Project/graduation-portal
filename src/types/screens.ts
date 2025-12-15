import { STATUS } from '../constants/app.constant';
export type StatusType = (typeof STATUS)[keyof typeof STATUS];
export interface Participant {
  id: string;
  name: string;
  progress: number;
  email: string;
  phone: string;
  address?: string; // Optional address field
  status?: StatusType;
}

export type StatusCount = {
  [K in StatusType]: number;
};

export interface ParticipantsResponse {
  result: {
    data: {
      count: number;
      participants: Participant[];
    };
  };
  statusCount?: StatusCount;
}

export interface ParticipantsQueryParams {
  searchKey?: string;
  status?: StatusType | '';
  page?: number;
  limit?: number;
}

// IDP / Pathway interfaces
export interface Pillar {
  name: string;
  tasks: number;
}

export interface PathwayData {
  id: string;
  title: string;
  description: string;
  tag: string;
  pillarsCount: number;
  tasksCount: number;
  version: string;
  includedPillars: Pillar[];
}

// export type InterventionPlanProps = {
//   participantId: string;
//   participantName?: string;
// }

export interface InterventionPlanProps {
  participantStatus?: StatusType;
  participantId?: string;
  participantName?: string;
};