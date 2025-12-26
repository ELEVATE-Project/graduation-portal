import { useCallback } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { Task, TaskStatus } from '../types/project.types';

export const useTaskActions = () => {
  const { updateTask, mode } = useProjectContext();

  const canEdit = mode === 'edit';

  const handleStatusChange = useCallback(
    (taskId: string, status: TaskStatus) => {
      if (!canEdit) return;
      updateTask(taskId, { status });
    },
    [canEdit, updateTask],
  );

  const handleFileUpload = useCallback(
    (taskId: string, files: File[]) => {
      if (!canEdit) return;
      // TODO: Implement file upload logic
      console.log('Upload files:', taskId, files);
    },
    [canEdit],
  );

  const handleOpenForm = useCallback(
    (taskId: string) => {
      if (!canEdit) return;
      // TODO: Implement form opening logic
      console.log('Open form:', taskId);
    },
    [canEdit],
  );

  const handleAddToPlan = useCallback(
    (taskId: string, currentMetadata: Task['metadata'], added: boolean) => {
      // Note: No canEdit guard here because this is specifically used in preview mode
      // to allow users to plan their intervention before entering edit mode
      updateTask(taskId, {
        metadata: {
          ...currentMetadata,
          addedToPlan: added,
        },
      });
    },
    [updateTask],
  );

  return {
    canEdit,
    handleStatusChange,
    handleFileUpload,
    handleOpenForm,
    handleAddToPlan,
  };
};
