import React, { useRef, useState, useMemo } from 'react';
import { Box, HStack, Card, Toast, ToastTitle, useToast } from '@ui';
import { useProjectContext } from '../../context/ProjectContext';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useLanguage } from '@contexts/LanguageContext';
import { TASK_STATUS } from '../../../constants/app.constant';
import { TaskCardProps } from '../../types/components.types';
import { Task } from '../../types/project.types';
import { taskCardStyles } from './Styles';
import { usePlatform } from '@utils/platform';
import {
  getTaskCardUIConfig,
  validateFileSize,
  isTaskCompleted,
} from './helpers';
import {
  renderFileInput,
  renderStatusIndicator,
  renderTaskInfo,
  renderActionButton,
  renderDivider,
  renderCustomTaskActions,
  renderModals,
} from './renderHelpers';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  level = 0,
  isLastTask = false,
  isChildOfProject = false,
}) => {
  const { mode, config, deleteTask } = useProjectContext();
  const { handleOpenForm, handleStatusChange, handleFileUpload } =
    useTaskActions();
  const { t } = useLanguage();
  const { isWeb } = usePlatform();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Toast helpers
  const showErrorToast = (message: string) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <Toast nativeID={id} action="error" variant="solid">
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    });
  };

  const showSuccessToast = (message: string) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <Toast nativeID={id} action="success" variant="solid">
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    });
  };

  // Unified modal state management
  type ModalType = 'edit' | 'delete' | null;
  const [modalState, setModalState] = useState<{
    type: ModalType;
    task?: Task;
  }>({
    type: null,
  });

  const isReadOnly = mode === 'read-only';
  const isPreview = mode === 'preview';
  const isEdit = mode === 'edit';
  const isCompleted = isTaskCompleted(task.status);
  const maxFileSize = config.maxFileSize || 10;

  // Configuration for rendering different UI styles
  const uiConfig = useMemo(
    () =>
      getTaskCardUIConfig(
        isChildOfProject,
        isPreview,
        isEdit,
        isUploading,
        task.type,
      ),
    [isChildOfProject, isPreview, isEdit, isUploading, task.type],
  );

  // File upload handler
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const { isValid } = validateFileSize(files, maxFileSize);

    if (!isValid) {
      showErrorToast(
        t('projectPlayer.fileSizeError', { maxSize: maxFileSize }),
      );
      return;
    }

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      await handleFileUpload(task._id, fileArray);
      handleStatusChange(task._id, TASK_STATUS.COMPLETED);
      showSuccessToast(t('projectPlayer.uploadSuccess'));
    } catch (error) {
      console.error('Upload failed:', error);
      showErrorToast(t('projectPlayer.uploadFailed'));
    } finally {
      setIsUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Task click handler
  const handleTaskClick = () => {
    if (!isEdit) return;

    if (task.type === 'observation') {
      handleOpenForm(task._id);
    } else if (task.type === 'file') {
      fileInputRef.current?.click();
    } else if (task.type === 'profile-update') {
      const newStatus = isCompleted ? TASK_STATUS.TO_DO : TASK_STATUS.COMPLETED;
      handleStatusChange(task._id, newStatus);
    }
  };

  // Checkbox change handler
  const handleCheckboxChange = (checked: boolean) => {
    if (!isEdit) return;
    const newStatus = checked ? TASK_STATUS.COMPLETED : TASK_STATUS.TO_DO;
    handleStatusChange(task._id, newStatus);
  };

  // Modal state management helpers
  const openEditModal = () => {
    setModalState({ type: 'edit', task });
  };

  const openDeleteModal = () => {
    setModalState({ type: 'delete' });
  };

  const closeModal = () => {
    setModalState({ type: null });
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    deleteTask(task._id);
    closeModal();
    showSuccessToast(t('projectPlayer.taskDeleted'));
  };

  // Main render logic
  // Card style for children of project tasks in EDIT and READ-ONLY modes
  if (uiConfig.showAsCard) {
    return (
      <>
        {renderFileInput({
          fileInputRef,
          taskType: task.type,
          isWeb,
          handleFileSelect,
          isEdit,
          isUploading,
        })}
        <Card {...taskCardStyles.childCard}>
          <Box {...taskCardStyles.childCardContent}>
            <HStack alignItems="center" justifyContent="space-between">
              <HStack flex={1} space="md" alignItems="center">
                {renderStatusIndicator({
                  showCheckbox: uiConfig.showCheckbox,
                  taskId: task._id,
                  isCompleted,
                  handleCheckboxChange,
                  isReadOnly,
                  isChildOfProject,
                })}
                {renderTaskInfo({
                  showCheckbox: uiConfig.showCheckbox,
                  isCompleted,
                  showAsCard: uiConfig.showAsCard,
                  taskName: task.name,
                  taskDescription: task.description,
                })}
              </HStack>
              <HStack space="xs" alignItems="center">
                {renderActionButton({
                  showActionButton: uiConfig.showActionButton,
                  showAsCard: uiConfig.showAsCard,
                  taskType: task.type,
                  isUploading,
                  handleTaskClick,
                  isReadOnly,
                  isEdit,
                  t,
                })}
                {renderCustomTaskActions({
                  isCustomTask: task.isCustomTask || false,
                  onEdit: openEditModal,
                  onDelete: openDeleteModal,
                })}
              </HStack>
            </HStack>
          </Box>
        </Card>
        {renderModals({
          modalState,
          onCloseModal: closeModal,
          onConfirmDelete: handleConfirmDelete,
          taskName: task.name,
          t,
        })}
      </>
    );
  }

  // Inline style for preview mode with project children
  if (isChildOfProject && isPreview) {
    return (
      <>
        {renderFileInput({
          fileInputRef,
          taskType: task.type,
          isWeb,
          handleFileSelect,
          isEdit,
          isUploading,
        })}
        <HStack {...taskCardStyles.previewInlineContainer}>
          {renderStatusIndicator({
            showCheckbox: uiConfig.showCheckbox,
            taskId: task._id,
            isCompleted,
            handleCheckboxChange,
            isReadOnly,
            isChildOfProject,
          })}
          {renderTaskInfo({
            showCheckbox: uiConfig.showCheckbox,
            isCompleted,
            showAsCard: uiConfig.showAsCard,
            taskName: task.name,
            taskDescription: task.description,
          })}
          {renderCustomTaskActions({
            isCustomTask: task.isCustomTask || false,
            onEdit: openEditModal,
            onDelete: openDeleteModal,
          })}
        </HStack>
        {renderDivider({
          isLastTask,
          isChildOfProject,
          isPreview,
        })}
        {renderModals({
          modalState,
          onCloseModal: closeModal,
          onConfirmDelete: handleConfirmDelete,
          taskName: task.name,
          t,
        })}
      </>
    );
  }

  // Default inline style for regular tasks (not children of project)
  return (
    <>
      {renderFileInput({
        fileInputRef,
        taskType: task.type,
        isWeb,
        handleFileSelect,
        isEdit,
        isUploading,
      })}
      <Box {...taskCardStyles.regularTaskContainer} marginLeft={level * 16}>
        <HStack alignItems="center" justifyContent="space-between">
          <HStack flex={1} space="md" alignItems="center">
            <Box {...taskCardStyles.statusIndicatorContainer}>
              {renderStatusIndicator({
                showCheckbox: uiConfig.showCheckbox,
                taskId: task._id,
                isCompleted,
                handleCheckboxChange,
                isReadOnly,
                isChildOfProject,
              })}
            </Box>
            {renderTaskInfo({
              showCheckbox: uiConfig.showCheckbox,
              isCompleted,
              showAsCard: uiConfig.showAsCard,
              taskName: task.name,
              taskDescription: task.description,
            })}
          </HStack>
          {renderActionButton({
            showActionButton: uiConfig.showActionButton,
            showAsCard: uiConfig.showAsCard,
            taskType: task.type,
            isUploading,
            handleTaskClick,
            isReadOnly,
            isEdit,
            t,
          })}
        </HStack>
      </Box>
      {renderDivider({
        isLastTask,
        isChildOfProject,
        isPreview,
      })}
      {renderModals({
        modalState,
        onCloseModal: closeModal,
        onConfirmDelete: handleConfirmDelete,
        taskName: task.name,
        t,
      })}
    </>
  );
};

export default TaskCard;