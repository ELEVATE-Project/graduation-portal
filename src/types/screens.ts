import { User } from '@contexts/AuthContext';
import { STATUS } from '../constants/app.constant';
import { ParticipantStatus, PathwayType } from './participant';
export type StatusType = (typeof STATUS)[keyof typeof STATUS];
export interface Participant {
  userId: string;
  name: string;
  progress?: number;
  status?: StatusType;
  userDetails?: User;
  idpProjectId?:string;
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

export interface TemplateData {
    id: string;
    title: string;
    description: string;
    tag: string;
    pillarsCount: number;
    tasksCount: number;
    version: string;
    includedPillars: {
        name: string;
        tasks: number;
    }[];
}

export interface InterventionPlanProps {
    participantStatus?: StatusType;
    participantId?: string;
    participantName?: string;
    participantProfile?:any;
    onIdpCreation?: (projectId?: string) => void;
}

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  tag: string;
  badgeBg?: string; // Badge background color token
  badgeTextColor?: string; // Badge text color token
  pillarsCount: number;
  tasksCount: number;
  version: string;
  includedPillars: {
    name: string;
    tasks: number;
  }[];
}

export interface ParticipantHeaderProps {
  participantName: string;
  participantId: string;
  status?: ParticipantStatus;
  pathway?: PathwayType;
  graduationProgress?: number;
  graduationDate?: string;
  onViewProfile?: () => void;
  areAllTasksCompleted?: boolean; 
  userEntityId?: string;
  onStatusUpdate?: (newStatus: string) => void;
}