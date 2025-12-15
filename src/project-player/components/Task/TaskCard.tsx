import React, { useRef, useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Button,
  ButtonText,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  Toast,
  ToastTitle,
  useToast,
} from '@ui';
// import { Pressable } from 'react-native';
import { LucideIcon } from '@ui/index';
import { useProjectContext } from '../../context/ProjectContext';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useLanguage } from '@contexts/LanguageContext';
import { TASK_STATUS } from '../../../constants/app.constant';
import { TaskCardProps } from '../../types/components.types';
// import { Task } from '../../types/project.types';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
// import AddCustomTaskModal from './AddCustomTaskModal';
import { taskCardStyles } from './Styles';
import FileUploadModal from './FileUploadModal';
import { usePlatform } from '@utils/platform';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  level = 0,
  isLastTask = false,
  isChildOfProject = false,
}) => {
  // deleteTask
  const { mode, config } = useProjectContext();
  const { handleOpenForm, handleStatusChange, handleFileUpload, handleAddToPlan } =
    useTaskActions();
  const { isWeb } = usePlatform();
  const { t } = useLanguage();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  // const [editingTask, setEditingTask] = useState<Task | null>(null);

  const isReadOnly = mode === 'read-only';
  const isPreview = mode === 'preview';
  const isEdit = mode === 'edit';
  const isCompleted = task.status === TASK_STATUS.COMPLETED;
  const isAddedToPlan = task.metadata?.addedToPlan;

  const maxFileSize = config.maxFileSize || 10;

  // Configuration for rendering different UI styles
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

  // Toast helper
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

  // File upload handler
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const maxSizeBytes = maxFileSize * 1024 * 1024;
    const invalidFiles = Array.from(files).filter(
      file => file.size > maxSizeBytes,
    );

    if (invalidFiles.length > 0) {
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

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast nativeID={id} action="success" variant="solid">
            <ToastTitle>{t('projectPlayer.uploadSuccess')}</ToastTitle>
          </Toast>
        ),
      });
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

  // Edit custom task handler
  // const handleEditTask = () => {
  //   setEditingTask(task);
  // };

  // Delete custom task handler
  // const handleDeleteTask = () => {
  //   // Show confirmation toast
  //   if (
  //     window.confirm(
  //       t('projectPlayer.confirmDeleteTask', { taskName: task.name }),
  //     )
  //   ) {
  //     deleteTask(task._id);
  //     toast.show({
  //       placement: 'top',
  //       render: ({ id }) => (
  //         <Toast nativeID={id} action="success" variant="solid">
  //           <ToastTitle>{t('projectPlayer.taskDeleted')}</ToastTitle>
  //         </Toast>
  //       ),
  //     });
  //   }
  // };

  // // Close edit modal
  // const handleCloseEditModal = () => {
  //   setEditingTask(null);
  // };

  // Button text helper
  const getButtonText = () => {
    // Specific Overrides for Onboarding Tasks
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
    const iconColor = theme.tokens.colors.textSecondary;
    const iconMap = {
      file: 'Upload',
      observation: 'FileText',
      'profile-update': 'User',
    } as const;

    const iconName = iconMap[task.type as keyof typeof iconMap];
    return iconName ? (
      <LucideIcon name={iconName} size={16} color={iconColor} />
    ) : null;
  };

  // Render file input (hidden)
  const renderFileInput = () => {
    if (task.type !== 'file') return null;
    if (!isWeb) return null;
    return (
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={taskCardStyles.hiddenInput}
        accept="*/*"
        disabled={!isEdit || isUploading}
      />
    );
  };

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
          aria-label={`Mark ${task.name} as ${isCompleted ? 'incomplete' : 'complete'
            }`}
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
    let checkColor: string = theme.tokens.colors.backgroundPrimary.light; // Default white check for filled circles

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
        // Mandatory Child Project Tasks (Screenshot shows Red Check Circle)
        circleBorderColor = '$primary500';
        circleBg = '$backgroundPrimary.light'; // White background
        checkColor = theme.tokens.colors.primary500; // Red check
        showCheck = true;
      }
    } else {
      // Regular tasks (not children of project)
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

  // Render task information (name and description)
  const renderTaskInfo = () => {
    const textStyle = uiConfig.showCheckbox
      ? {
        textDecorationLine: (isCompleted ? 'line-through' : 'none') as
          | 'line-through'
          | 'none',
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
        {/* CHANGED: Added wordBreak 'normal' to prevent splitting */}
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

  // Render action button
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

    // Regular action button for non-optional tasks
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

  // Render edit/delete actions for custom tasks
  // const renderCustomTaskActions = () => {
  //   if (!task.isCustomTask) return null;

  //   return (
  //     <HStack {...taskCardStyles.customActionsContainer}>
  //       {/* Edit Icon */}
  //       <Pressable onPress={handleEditTask}>
  //         <Box
  //           {...taskCardStyles.editActionBox}
  //           sx={{
  //             ':hover': {
  //               bg: taskCardStyles.editActionBox.hoverBg,
  //             },
  //           }}
  //         >
  //           <LucideIcon
  //             name="Pencil"
  //             size={16}
  //             color={theme.tokens.colors.primary500}
  //           />
  //         </Box>
  //       </Pressable>
  // 
  //       {/* Delete Icon */}
  //       <Pressable onPress={handleDeleteTask}>
  //         <Box
  //           {...taskCardStyles.deleteActionBox}
  //           sx={{
  //             ':hover': {
  //               bg: taskCardStyles.deleteActionBox.hoverBg,
  //             },
  //           }}
  //         >
  //           <LucideIcon
  //             name="Trash2"
  //             size={16}
  //             color={theme.tokens.colors.error500}
  //           />
  //         </Box>
  //       </Pressable>
  //     </HStack>
  //   );
  // };

  // Main render logic
  // Render file upload modal
  const renderUploadModal = () => (
    <FileUploadModal
      isOpen={showUploadModal}
      onClose={() => setShowUploadModal(false)}
      taskName={task.name}
      participantName={config.profileInfo?.name}
      onUpload={(method) => {
        console.log('Upload method selected:', method);
        // File upload logic handled within modal
      }}
      onConfirm={() => {
        handleStatusChange(task._id, TASK_STATUS.COMPLETED);
        setShowUploadModal(false);
      }}
    />
  );

  // Main render logic
  // Card style for children of project tasks in EDIT and READ-ONLY modes
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
                {/* {renderCustomTaskActions()} */}
              </HStack>
            </HStack>
          </Box>
        </Card>

        {/* Edit Task Modal */}
        {/* {editingTask && (
          <AddCustomTaskModal
            isOpen={!!editingTask}
            onClose={handleCloseEditModal}
            task={editingTask}
            mode="edit"
          />
        )} */}
        {renderUploadModal()}
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
          {/* {renderCustomTaskActions()} */}
          <Box marginLeft="auto">
            {renderActionButton()}
          </Box>
        </HStack>
        {renderDivider()}

        {/* Edit Task Modal */}
        {/* {editingTask && (
          <AddCustomTaskModal
            isOpen={!!editingTask}
            onClose={handleCloseEditModal}
            task={editingTask}
            mode="edit"
          />
        )} */}
        {renderUploadModal()}
      </>
    );
  }

  // Default inline style for regular tasks (not children of project)
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
          </Box>
        </HStack>
      </Box>
      {renderDivider()}

      {/* File Upload Modal */}
      {renderUploadModal()}
    </>
  );
};

export default TaskCard;
