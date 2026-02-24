import { Task, ProjectData } from '../types/project.types';
import { TASK_STATUS } from '../../constants/app.constant';

/**
 * Recursively check if all tasks (including nested children) are completed
 * @param tasks - Array of tasks to check
 * @returns true if all tasks are completed, false otherwise
 */
export const areAllTasksCompleted = (tasks: Task[]): boolean => {
  if (!tasks || tasks.length === 0) {
    return false; // No tasks means not all completed
  }

  return tasks.every(task => {
    // Check if current task is completed
    // If status is undefined, consider it as not completed (to-do)
    const isCurrentTaskCompleted = task.status === TASK_STATUS.COMPLETED;

    // If task has children, recursively check them
    if (task.children && task.children.length > 0) {
      const areChildrenCompleted = areAllTasksCompleted(task.children);
      return isCurrentTaskCompleted && areChildrenCompleted;
    }

    // For tasks without children, just check their own status
    return isCurrentTaskCompleted;
  });
};

/**
 * Check if all tasks in a project are completed
 * @param projectData - Project data containing tasks
 * @returns true if all tasks are completed, false otherwise
 */
export const isProjectFullyCompleted = (
  projectData: ProjectData | null,
): boolean => {
  if (!projectData || !projectData.tasks || projectData.tasks.length === 0) {
    return false;
  }

  return areAllTasksCompleted(projectData.tasks);
};
