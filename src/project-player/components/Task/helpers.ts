import { Task } from '../../types/project.types';
import { TASK_STATUS } from '../../../constants/app.constant';

/**
 * Get button text based on task type and upload state
 */
export const getTaskButtonText = (
  taskType: Task['type'],
  isUploading: boolean,
  t: (key: string) => string,
): string => {
  if (taskType === 'file') {
    return isUploading
      ? t('projectPlayer.uploading')
      : t('projectPlayer.uploadFile');
  }
  if (taskType === 'observation') return t('projectPlayer.completeForm');
  if (taskType === 'profile-update') return t('projectPlayer.updateProfile');
  return t('projectPlayer.viewTask');
};

/**
 * Get button icon name based on task type
 */
export const getTaskButtonIconName = (
  taskType: Task['type'],
): 'Upload' | 'FileText' | 'User' | null => {
  const iconMap = {
    file: 'Upload',
    observation: 'FileText',
    'profile-update': 'User',
  } as const;

  return iconMap[taskType as keyof typeof iconMap] || null;
};

/**
 * Calculate UI configuration for task card rendering
 */
export const getTaskCardUIConfig = (
  isChildOfProject: boolean,
  isPreview: boolean,
  isEdit: boolean,
  isUploading: boolean,
  taskType: Task['type'],
) => ({
  showAsCard: isChildOfProject && !isPreview,
  showAsInline: !isChildOfProject || isPreview,
  showCheckbox: isChildOfProject && !isPreview,
  showActionButton:
    !isPreview &&
    (taskType === 'file' ||
      taskType === 'observation' ||
      taskType === 'profile-update'),
  isInteractive: isEdit && !isUploading,
});

/**
 * Validate file size
 */
export const validateFileSize = (
  files: FileList | null,
  maxSizeMB: number,
): { isValid: boolean; invalidFiles: File[] } => {
  if (!files || files.length === 0) {
    return { isValid: false, invalidFiles: [] };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const invalidFiles = Array.from(files).filter(
    file => file.size > maxSizeBytes,
  );

  return {
    isValid: invalidFiles.length === 0,
    invalidFiles,
  };
};

/**
 * Get status circle color based on task state
 */
export const getStatusCircleColor = (
  isChildOfProject: boolean,
  isCompleted: boolean,
): string => {
  if (isChildOfProject) return '$primary500';
  if (isCompleted) return '$accent200';
  return '$textMuted';
};

/**
 * Get text style for completed tasks
 */
export const getCompletedTaskTextStyle = (isCompleted: boolean) => ({
  textDecorationLine: (isCompleted ? 'line-through' : 'none') as
    | 'line-through'
    | 'none',
  opacity: isCompleted ? 0.6 : 1,
});

/**
 * Check if task is completed
 */
export const isTaskCompleted = (status?: string): boolean =>
  status === TASK_STATUS.COMPLETED;
