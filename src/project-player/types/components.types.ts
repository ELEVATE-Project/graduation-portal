import { Task, ProjectData, Attachment, TaskStatus } from './project.types';

// ============================================
// TASK COMPONENT PROPS
// ============================================

export interface TaskCardProps {
  task: Task;
  level?: number;
  isLastTask?: boolean;
  isChildOfProject?: boolean; // New prop to detect if child of project
}

export interface TaskStatusProps {
  status: TaskStatus;
  isReadOnly: boolean;
  onStatusChange?: (status: TaskStatus) => void;
}

export interface TaskAccordionProps {
  task: Task;
  level?: number;
}

export interface TaskComponentProps {
  task: Task;
  level?: number;
  isLastTask?: boolean;
  isChildOfProject?: boolean; // New prop
}

export interface UploadComponentProps {
  taskId: string;
  attachments?: Attachment[];
}

export interface ObservationPopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formId: string;
}

// ============================================
// PROJECT COMPONENT PROPS
// ============================================

export interface ProjectInfoCardProps {
  project: ProjectData;
}

export interface ProjectAsTaskComponentProps {
  task: Task;
  level?: number;
}

export interface ProjectContextValue {
  projectData: ProjectData | null;
  isLoading: boolean;
  error: Error | null;
  mode: 'preview' | 'edit' | 'read-only';
  config: ProjectPlayerConfig; // Full config object

  // Actions
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateProjectInfo: (updates: Partial<ProjectData>) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  saveLocal: () => void;
  syncToServer: () => Promise<void>;
}

export interface ProjectProviderProps {
  children: React.ReactNode;
  config: ProjectPlayerConfig;
  initialData: ProjectData | null;
}

// ============================================
// MAIN COMPONENT PROPS
// ============================================

export interface ProjectPlayerConfig {
  mode: 'preview' | 'edit' | 'read-only';
  solutionId?: string;
  projectId?: string;
  permissions?: {
    canEdit: boolean;
    canAddTask: boolean;
    canDelete: boolean;
  };
  maxFileSize?: number; // in MB
  baseUrl?: string;
  accessToken?: string;
  language?: string;
  profileInfo?: {
    id: number | string;
    name: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
  redirectionLinks?: {
    unauthorizedRedirectUrl?: string;
    // loginRedirectUrl?: string;
    // homeRedirectUrl?: string;
    [key: string]: any;
  };
}

export interface ProjectPlayerData {
  solutionId?: string;
  projectId?: string;
  localData?: ProjectData;
}

export interface ProjectPlayerProps {
  config: ProjectPlayerConfig;
  data?: ProjectPlayerData;
  projectData?: any; // as per mock data json
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
