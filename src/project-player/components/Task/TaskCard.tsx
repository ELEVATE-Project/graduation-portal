import React, { useRef, useState, useMemo } from 'react';
import { Box, HStack, Card, Toast, ToastTitle, useToast, Checkbox, CheckboxIndicator, CheckboxIcon, VStack, Text, Button, ButtonText } from '@ui';
import { useProjectContext } from '../../context/ProjectContext';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useLanguage } from '@contexts/LanguageContext';
import { TASK_STATUS } from '../../../constants/app.constant';
import { TaskCardProps } from '../../types/components.types';
import { Task } from '../../types/project.types';
import { taskCardStyles } from './Styles';
import { LucideIcon } from '@ui/index';
import { Pressable } from 'react-native'; // Needed for local renders if any, or custom actions
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

// HEAD imports
import FileUploadModal from './FileUploadModal';
import { usePlatform } from '@utils/platform';

// Incoming imports / helpers
import {
  validateFileSize,
  isTaskCompleted,
} from './helpers';
import {
  renderCustomTaskActions,
  renderModals,
} from './renderHelpers';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  level = 0,
  isLastTask = false,
  isChildOfProject = false,
}) => {
  const { mode, config, deleteTask } = useProjectContext(); // Added deleteTask from Incoming
  const { handleOpenForm, handleStatusChange, handleFileUpload, handleAddToPlan } = useTaskActions(); // Kept handleAddToPlan from HEAD
  const { isWeb } = usePlatform();
  const { t } = useLanguage();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false); // From HEAD

  // Modal state management (from Incoming)
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
  // Use mixed logic for completion: check status or use helper
  const isCompleted = isTaskCompleted(task.status) || task.status === TASK_STATUS.COMPLETED;
  const isAddedToPlan = task.metadata?.addedToPlan;

  const maxFileSize = config.maxFileSize || 10;

  // Configuration (Merged from HEAD logic + helpers if needed)
  // We keep HEAD logic mainly because of the 'Add to Plan' button requirement which uiConfig drives
  const uiConfig = useMemo(
    () => ({
      showAsCard: isChildOfProject,
      showAsInline: !isChildOfProject || isPreview,
      showCheckbox: isChildOfProject && !isPreview,
      showActionButton:
        task.metadata?.isOptional || // Always show for optional tasks (Add/Remove)
        (!isPreview &&
          (task.type === 'file' ||
            task.type === 'observation' ||
            task.type === 'profile-update')),
      isInteractive: isEdit && !isUploading,
    }),
    [isChildOfProject, isPreview, isEdit, isUploading, task.type, task.metadata?.isOptional],
  );

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

  // Modal actions (Incoming)
  const openEditModal = () => {
    setModalState({ type: 'edit', task });
  };

  const openDeleteModal = () => {
    setModalState({ type: 'delete' });
  };

  const closeModal = () => {
    setModalState({ type: null });
  };

  const handleConfirmDelete = () => {
    deleteTask(task._id);
    closeModal();
    showSuccessToast(t('projectPlayer.taskDeleted'));
  };

  // Task click handler (HEAD logic)
  const handleTaskClick = () => {
    if (!isEdit) return;

    if (task.type === 'observation') {
      handleOpenForm(task._id);
    } else if (task.type === 'file') {
      setShowUploadModal(true); // Open modal instead of file picker
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

  // Render hidden file input (Incoming/HEAD mixed) - Only if needed, but HEAD uses Modal
  const renderFileInput = () => {
    // HEAD didn't really use this much because of Modal, but Incoming had extensive logic.
    // We'll keep it simple or return null if using modal exclusively.
    // HEAD:
    if (task.type !== 'file') return null;
    if (!isWeb) return null;
    return (
      <input
        ref={fileInputRef}
        type="file" // Standard file input
        multiple
        style={taskCardStyles.hiddenInput}
        accept="*/*"
        disabled={!isEdit || isUploading}
        onChange={(e) => {
          // Basic handle if we ever used this, but we use Modal now.
          // keeping implementation minial to satisfy TS if referenced
        }}
      />
    );
  };

  // Custom Renderers (From HEAD to preserve styling)

  // Render task status indicator (circle or checkbox)
  const renderStatusIndicator = () => {
    if (uiConfig.showCheckbox) {
      return (
        <Checkbox
          value={task._id}
          isChecked={isCompleted}
          onChange={handleCheckboxChange}
          isDisabled={isReadOnly}
          size="md"
          aria-label={`Mark ${task.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
          opacity={isReadOnly ? 0.6 : 1}
        >
          <CheckboxIndicator
            borderColor={isCompleted ? '$primary500' : '$textMuted'}
            bg={isCompleted ? '$primary500' : '$backgroundPrimary.light'}
          >
            <CheckboxIcon color="$backgroundPrimary.light">
              <LucideIcon
                name="Check"
                size={12}
                color={theme.tokens.colors.backgroundPrimary.light}
                strokeWidth={3}
              />
            </CheckboxIcon>
          </CheckboxIndicator>
        </Checkbox>
      );
    }

    // Simple status circle
    const circleSize = 24;
    const checkSize = 14;

    // Status Circle Logic
    const isOptional = task.metadata?.isOptional;

    let circleBorderColor = '$textMuted';
    let circleBg = '$backgroundPrimary.light';
    let showCheck = false;
    let checkColor: string = theme.tokens.colors.backgroundPrimary.light;

    if (isChildOfProject) {
      if (isOptional) {
        if (isAddedToPlan) {
          circleBorderColor = '$success500';
          circleBg = '$success500'; // Filled green circle
          checkColor = theme.tokens.colors.backgroundPrimary.light; // White check
          showCheck = true;
        } else {
          circleBorderColor = '$textMuted'; // Empty gray circle
          showCheck = false;
        }
      } else {
        // Mandatory Child Project Tasks
        circleBorderColor = '$primary500';
        circleBg = '$backgroundPrimary.light';
        checkColor = theme.tokens.colors.primary500;
        showCheck = true;
      }
    } else {
      // Regular tasks
      circleBorderColor = isCompleted ? '$accent200' : '$textMuted';
      circleBg = isCompleted ? '$accent200' : '$backgroundPrimary.light';
      checkColor = theme.tokens.colors.backgroundPrimary.light;
      showCheck = isCompleted;
    }

    return (
      <Box
        width={circleSize}
        height={circleSize}
        {...taskCardStyles.statusCircle}
        borderColor={circleBorderColor}
        bg={circleBg}
      >
        {showCheck && (
          <LucideIcon
            name="Check"
            size={checkSize}
            color={checkColor}
            strokeWidth={3}
          />
        )}
      </Box>
    );
  };

  // Render task information (name and description) - HEAD logic with Badges
  const renderTaskInfo = () => {
    const textStyle = uiConfig.showCheckbox
      ? {
        textDecorationLine: (isCompleted ? 'line-through' : 'none') as 'line-through' | 'none',
        opacity: isCompleted ? 0.6 : 1,
      }
      : {};

    const titleTypography = uiConfig.showAsCard ? TYPOGRAPHY.h4 : TYPOGRAPHY.h3;

    // Task badge rendering (Evidence Required / Optional)
    const taskBadge = task.metadata?.badgeText ? (
      <Box
        bg={
          task.metadata.badgeType === 'required'
            ? '$warning100'
            : task.metadata.badgeType === 'optional'
              ? '#DBEAFE'
              : '$backgroundLight100'
        }
        paddingHorizontal="$1"
        paddingVertical="$1"
        borderRadius="$sm"
        alignSelf="flex-start"
        marginTop="$1"
      >
        <Text
          fontSize="$xs"
          fontWeight="$medium"
          color={
            task.metadata.badgeType === 'required'
              ? '$warning900'
              : task.metadata.badgeType === 'optional'
                ? '#1e40af'
                : '$textMuted'
          }
        >
          {task.metadata.badgeText}
        </Text>
      </Box>
    ) : null;

    return (
      <VStack flex={1} space="xs" flexShrink={1}>
        <Text
          {...titleTypography}
          color="$textPrimary"
          {...textStyle}
          style={
            isWeb
              ? ({
                wordBreak: 'normal',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
              } as any)
              : undefined
          }
        >
          {task.name}
        </Text>
        {taskBadge}
        {task.description && (
          <Text
            {...(uiConfig.showAsCard
              ? TYPOGRAPHY.bodySmall
              : TYPOGRAPHY.paragraph)}
            color="$textSecondary"
            lineHeight="$lg"
            {...textStyle}
            style={
              isWeb
                ? ({
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                } as any)
                : undefined
            }
          >
            {task.description}
          </Text>
        )}
      </VStack>
    );
  };

  // Button text helper (HEAD logic)
  const getButtonText = () => {
    if (task.name === 'Capture Consent') return t('projectPlayer.uploadConsent');
    if (task.name === 'Upload SLA Form') return t('projectPlayer.uploadSLA');
    if (task.name === 'Complete Household Profile') return t('projectPlayer.completeProfile');

    if (task.type === 'file') {
      return isUploading
        ? t('projectPlayer.uploading')
        : t('projectPlayer.uploadFile');
    }
    if (task.type === 'observation') return t('projectPlayer.completeForm');
    if (task.type === 'profile-update') return t('projectPlayer.updateProfile');
    return t('projectPlayer.viewTask');
  };

  // Button icon helper
  const getButtonIcon = () => {
    if (task.type === 'file') return <LucideIcon name="Upload" size={16} color={theme.tokens.colors.textSecondary} />;
    if (task.type === 'observation') return <LucideIcon name="FileText" size={16} color={theme.tokens.colors.textSecondary} />;
    if (task.type === 'profile-update') return <LucideIcon name="User" size={16} color={theme.tokens.colors.textSecondary} />;
    return null;
  };

  // Render action button (HEAD logic)
  const renderActionButton = () => {
    if (!uiConfig.showActionButton) return null;

    // If task is optional, show "Add to Plan" button instead
    if (task.metadata?.isOptional) {
      if (isAddedToPlan) {
        return (
          <Button
            variant="solid"
            size="sm"
            bg="$error500"
            borderColor="$error500"
            onPress={() => handleAddToPlan(task._id, task.metadata, false)}
            sx={{
              ':hover': { bg: '$error600' }
            }}
          >
            <ButtonText
              color="$white"
              fontSize="$xs"
              fontWeight="$medium"
            >
              Remove
            </ButtonText>
          </Button>
        );
      }
      return (
        <Button
          variant="outline"
          size="sm"
          borderColor="$success500"
          onPress={() => handleAddToPlan(task._id, task.metadata, true)}
          sx={{
            ':hover': { bg: '$success50' }
          }}
        >
          <ButtonText
            color="$success500"
            fontSize="$xs"
            fontWeight="$medium"
          >
            Add to Plan
          </ButtonText>
        </Button>
      );
    }

    const buttonStyles = uiConfig.showAsCard
      ? taskCardStyles.actionButtonCard
      : taskCardStyles.actionButtonInline;

    return (
      <Button
        {...taskCardStyles.actionButton}
        onPress={handleTaskClick}
        isDisabled={isReadOnly || isUploading}
        borderRadius={uiConfig.showAsCard ? undefined : 10}
        borderColor={buttonStyles.borderColor}
        opacity={isReadOnly || isUploading ? 0.5 : 1}
        sx={{
          ':hover': {
            bg: isEdit ? buttonStyles.hoverBg : 'transparent',
            borderColor: '$primary500',
          },
        }}
      >
        <HStack space="xs" alignItems="center">
          {getButtonIcon()}
          <ButtonText
            {...TYPOGRAPHY.button}
            {...taskCardStyles.actionButtonText}
            fontSize={uiConfig.showAsCard ? '$sm' : undefined}
            sx={{
              ':hover': {
                color: taskCardStyles.actionButtonTextHover.color,
              },
            }}
          >
            {getButtonText()}
          </ButtonText>
        </HStack>
      </Button>
    );
  };

  // Render divider
  const renderDivider = () => {
    if (isLastTask) return null;
    return (
      <Box
        {...taskCardStyles.divider}
        marginVertical={isChildOfProject && isPreview ? '$1' : undefined}
        marginHorizontal={!isChildOfProject ? '$5' : undefined}
      />
    );
  };

  // Render file upload modal (HEAD logic)
  const renderUploadModal = () => (
    <FileUploadModal
      isOpen={showUploadModal}
      onClose={() => setShowUploadModal(false)}
      taskName={task.name}
      participantName={config.profileInfo?.name}
      onUpload={(method) => {
        // console.log('Upload method selected:', method);
      }}
      onConfirm={() => {
        handleStatusChange(task._id, TASK_STATUS.COMPLETED);
        setShowUploadModal(false);
      }}
    />
  );

  // Main Render Logic

  if (uiConfig.showAsCard) {
    return (
      <>
        {renderFileInput()}
        <Card {...taskCardStyles.childCard}>
          <Box {...taskCardStyles.childCardContent}>
            <HStack alignItems="center" justifyContent="space-between">
              <HStack flex={1} space="md" alignItems="center">
                {renderStatusIndicator()}
                {renderTaskInfo()}
              </HStack>
              <HStack space="xs" alignItems="center">
                {renderActionButton()}
                {renderCustomTaskActions({
                  isCustomTask: task.isCustomTask || false,
                  onEdit: openEditModal,
                  onDelete: openDeleteModal,
                })}
              </HStack>
            </HStack>
          </Box>
        </Card>
        {renderUploadModal()}
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
        {renderFileInput()}
        <HStack
          {...taskCardStyles.previewInlineContainer}
          padding="$4"
          bg={isAddedToPlan ? '#DCFCE7' : 'transparent'}
          borderColor={isAddedToPlan ? '#BBF7D0' : 'transparent'}
          borderWidth={isAddedToPlan ? 1 : 0}
          borderRadius="$lg"
          marginBottom="$2"
        >
          {renderStatusIndicator()}
          {renderTaskInfo()}
          <Box marginLeft="auto">
            {renderActionButton()}
            {renderCustomTaskActions({
              isCustomTask: task.isCustomTask || false,
              onEdit: openEditModal,
              onDelete: openDeleteModal,
            })}
          </Box>
        </HStack>
        {renderDivider()}
        {renderUploadModal()}
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

  // Default inline style for regular tasks
  return (
    <>
      {renderFileInput()}
      <Box {...taskCardStyles.regularTaskContainer} marginLeft={level * 16}>
        <HStack alignItems="center" justifyContent="space-between">
          <HStack flex={1} alignItems="center" gap="$3" flexShrink={1}>
            <Box flexShrink={0}>
              {renderStatusIndicator()}
            </Box>
            <Box flex={1} flexShrink={1}>
              {renderTaskInfo()}
            </Box>
          </HStack>
          <Box flexShrink={0}>
            {renderActionButton()}
            {renderCustomTaskActions({
              isCustomTask: task.isCustomTask || false,
              onEdit: openEditModal,
              onDelete: openDeleteModal,
            })}
          </Box>
        </HStack>
      </Box>
      {renderDivider()}
      {renderUploadModal()}
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
