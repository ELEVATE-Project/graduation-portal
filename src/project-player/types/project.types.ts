import {
  TASK_STATUS,
  PROJECT_STATUS,
  UPLOAD_STATUS,
} from '../../constants/app.constant';

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export interface ProjectData {
  _id: string;
  solutionId: string;
  name: string;
  description: string;
  status: (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
  progress: number;
  tasks: Task[];
  metaData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  name: string;
  description?: string;
  type: 'simple' | 'file' | 'observation' | 'project' | 'profile-update';
  status?: TaskStatus;
  isRequired?: boolean;
  children?: Task[]; // For nested project tasks
  attachments?: Attachment[];
  observationFormId?: string;
  metadata?: {
    minFiles?: number; // Minimum files required for file-type tasks
    maxFiles?: number; // Maximum files allowed for file-type tasks
    formCompleted?: boolean; // For observation tasks
    [key: string]: any;
  };
}

export interface Attachment {
  _id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  localPath?: string;
  uploadStatus: (typeof UPLOAD_STATUS)[keyof typeof UPLOAD_STATUS];
  createdAt: string;
}
