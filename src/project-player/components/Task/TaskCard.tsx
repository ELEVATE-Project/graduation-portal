import React, { useState, useMemo } from 'react';
import { Box, HStack, Card, Toast, ToastTitle, useToast, Checkbox, CheckboxIndicator, CheckboxIcon, VStack, Text, Button, ButtonText, Pressable, CheckIcon } from '@ui';
import { useProjectContext } from '../../context/ProjectContext';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useLanguage } from '@contexts/LanguageContext';
import { TASK_STATUS } from '../../../constants/app.constant';
import { TaskCardProps } from '../../types/components.types';
import { Task } from '../../types/project.types';
import { taskCardStyles } from './Styles';
import { LucideIcon } from '@ui/index';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import FileUploadModal from './FileUploadModal';
import EvidencePreviewModal from './EvidencePreviewModal';
import { usePlatform } from '@utils/platform';
import { isTaskCompleted } from './helpers';
import { renderCustomTaskActions, renderModals } from './renderHelpers';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  level = 0,
  isLastTask = false,
  isChildOfProject = false,
}) => {
  // Retrieve updateTask from context
  const { mode, config, projectData, updateTask } = useProjectContext();
  const { deleteTask } = useProjectContext();
  const { handleOpenForm, handleStatusChange, handleAddToPlan } = useTaskActions();
  const { isWeb } = usePlatform();
  const { t } = useLanguage();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
      placement: 'bottom right',
      render: ({ id }) => (
        <Toast
          nativeID={id}
          action="success"
          variant="solid"
          {...taskCardStyles.successToast}
        >
          <HStack {...taskCardStyles.successToastContent}>
            <Box {...taskCardStyles.successToastIcon}>
              <LucideIcon name="Check" size={taskCardStyles.successToastIconSize} color="white" strokeWidth={3} />
            </Box>
            <ToastTitle {...taskCardStyles.successToastTitle}>
              {message}
            </ToastTitle>
          </HStack>
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
            alignItems="center"
            justifyContent="center"
          >
            <CheckboxIcon as={CheckIcon} color="$accent100" />
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
          // Added to Plan: Outlined green circle with green check (like mandatory tasks style)
          circleBorderColor = '$success500';
          circleBg = '$backgroundPrimary.light'; // White/transparent bg
          checkColor = theme.tokens.colors.success500; // Green check
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
      circleBorderColor = isCompleted ? '$success500' : '$textMuted'; // Green Border (Outlined)
      circleBg = isCompleted ? 'transparent' : '$backgroundPrimary.light'; // Transparent BG
      checkColor = isCompleted ? theme.tokens.colors.success500 : theme.tokens.colors.backgroundPrimary.light; // Green Check
      showCheck = isCompleted;
    }

    return (
      <Box
        width={circleSize}
        height={circleSize}
        {...taskCardStyles.statusCircle}
        alignSelf="center"
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
    // In Edit mode, hide Optional badges - only show 'required' type badges
    const isEditModeForBadge = isEdit && !isPreview;
    const shouldShowBadge = task.metadata?.badgeText &&
      (!isEditModeForBadge || task.metadata?.badgeType === 'required');

    const taskBadge = shouldShowBadge ? (
      <Box
        bg={
          task.metadata?.badgeType === 'required'
            ? '$warning100'
            : task.metadata?.badgeType === 'optional'
              ? '$optionalBadgeBg'
              : '$backgroundLight100'
        }
        paddingHorizontal="$2"
        paddingVertical="$1"
        borderRadius="$md"
        alignSelf="center"
      >
        <Text
          fontSize="$xs"
          fontWeight="$medium"
          color={
            task.metadata?.badgeType === 'required'
              ? '$warning900'
              : task.metadata?.badgeType === 'optional'
                ? '$optionalBadgeText'
                : '$textMuted'
          }
        >
          {task.metadata?.badgeText}
        </Text>
      </Box>
    ) : null;

    // Status badge for Intervention Plan Edit mode only (not Onboarding)
    // isEditModeOnly is true ONLY for Intervention Plan tasks that are children of pillars
    const isEditModeOnly = isEdit && !isPreview && isChildOfProject;
    const statusBadge = (isEditModeOnly && uiConfig.showAsCard) ? (
      <Box
        bg={isCompleted ? '$textMuted' : '$primary500'}
        paddingHorizontal="$2"
        paddingVertical="$1"
        borderRadius="$md"
        alignSelf="flex-start"
      >
        <Text
          fontSize="$xs"
          fontWeight="$semibold"
          color="$white"
        >
          {isCompleted ? t('projectPlayer.done') : t('projectPlayer.toDo')}
        </Text>
      </Box>
    ) : null;

    // In Edit mode only (non-preview), hide description
    const showDescription = !isEditModeOnly || !uiConfig.showAsCard;

    return (
      <VStack space="xs" flex={1}>
        {/* Preview mode OR Read-only mode: title and badges on same line */}
        {(isPreview || isReadOnly) ? (
          <HStack space="sm" alignItems="center" flexWrap="wrap">
            <Text
              {...titleTypography}
              color="$textPrimary"
              {...textStyle}
              fontSize={((!isWeb && !uiConfig.showAsCard) ? "$sm" : (titleTypography as any).fontSize) as any}
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
          </HStack>
        ) : (
          /* Edit mode: title on first line, badges on second line */
          <>
            <Text
              {...titleTypography}
              color="$textPrimary"
              {...textStyle}
              fontSize={((!isWeb && !uiConfig.showAsCard) ? "$sm" : (titleTypography as any).fontSize) as any}
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
            <HStack space="sm" alignItems="center" flexWrap="wrap">
              {statusBadge}
              {taskBadge}
              {/* File count tag for Edit mode when files exist */}
              {isEditModeOnly && task.attachments && task.attachments.length > 0 && (
                <Pressable onPress={() => setShowPreviewModal(true)}>
                  {(state: any) => {
                    const isHovered = state?.hovered || state?.pressed || false;
                    return (
                      <Box
                        bg={isHovered ? '$hoverPink' : '$backgroundLight100'}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$sm"
                        borderWidth={1}
                        borderColor={isHovered ? '$primary300' : '$borderLight300'}
                        $web-cursor="pointer"
                      >
                        <HStack space="xs" alignItems="center">
                          <LucideIcon
                            name="Paperclip"
                            size={12}
                            color={isHovered ? theme.tokens.colors.primary500 : theme.tokens.colors.textSecondary}
                          />
                          <Text
                            fontSize="$xs"
                            color={isHovered ? '$primary500' : '$textSecondary'}
                          >
                            {task.attachments?.length} {task.attachments?.length === 1 ? t('projectPlayer.file') : t('projectPlayer.files')}
                          </Text>
                        </HStack>
                      </Box>
                    );
                  }}
                </Pressable>
              )}
            </HStack>
          </>
        )}
        {showDescription && task.description && (
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
    // Intervention Plan Edit mode = isEdit && !isPreview && isChildOfProject
    // Only for Intervention Plan Edit mode, always show Upload Evidence for file tasks
    const isInterventionPlanEditMode = isEdit && !isPreview && isChildOfProject;

    // For file tasks, if completed:
    // - Onboarding: show Edit button (original behavior)
    // - Intervention Plan Edit mode: show Upload Evidence (new behavior)
    if (task.type === 'file' && isCompleted && !isInterventionPlanEditMode) return t('common.edit') || 'Edit';

    if (task.name === 'Capture Consent') return t('projectPlayer.uploadConsent');
    if (task.name === 'Upload SLA Form') return t('projectPlayer.uploadSLA');
    if (task.name === 'Complete Household Profile') return t('projectPlayer.completeProfile');

    if (task.type === 'file') {
      return isUploading
        ? t('projectPlayer.uploading')
        : t('projectPlayer.uploadEvidence');  // Edit mode uses Upload Evidence
    }
    if (task.type === 'observation') return t('projectPlayer.completeForm');
    if (task.type === 'profile-update') return t('projectPlayer.updateProfile');
    return t('projectPlayer.viewTask');
  };

  // Button icon helper
  const getButtonIcon = () => {
    const iconColor = theme.tokens.colors.textSecondary;
    // Only for Intervention Plan Edit mode, always show Upload icon
    const isInterventionPlanEditMode = isEdit && !isPreview && isChildOfProject;
    if (task.type === 'file') {
      // - Onboarding: show Pencil icon when completed (original behavior)
      // - Intervention Plan Edit mode: always show Upload icon (new behavior)
      if (isCompleted && !isInterventionPlanEditMode) return <LucideIcon name="Pencil" size={16} color={iconColor} />;
      return <LucideIcon name="Upload" size={16} color={iconColor} />;
    }
    if (task.type === 'observation') return <LucideIcon name="FileText" size={16} color={iconColor} />;
    if (task.type === 'profile-update') return <LucideIcon name="User" size={16} color={iconColor} />;
    return null;
  };

  // Render action button (HEAD logic)
  const renderActionButton = () => {
    if (!uiConfig.showActionButton) return null;

    // In Preview mode only: If task is optional, show "Add to Plan" / "Remove" button
    if (isPreview && task.metadata?.isOptional) {
      if (isAddedToPlan) {
        return (
          <Button
            variant="solid"
            size={isWeb ? "sm" : "xs"}
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
              {t('projectPlayer.remove')}
            </ButtonText>
          </Button>
        );
      }
      return (
        <Button
          variant="outline"
          size={isWeb ? "sm" : "xs"}
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
            {t('projectPlayer.addToPlan')}
          </ButtonText>
        </Button>
      );
    }

    const buttonStyles = uiConfig.showAsCard
      ? taskCardStyles.actionButtonCard
      : taskCardStyles.actionButtonInline;

    // Get icon name based on task type
    // For Intervention Plan Edit mode, always show Upload icon
    const isInterventionPlanEditMode = isEdit && !isPreview && isChildOfProject;
    const getIconName = () => {
      if (task.type === 'file') {
        // Onboarding: show Pencil when completed
        // Intervention Plan Edit mode: always show Upload
        return (isCompleted && !isInterventionPlanEditMode) ? 'Pencil' : 'Upload';
      }
      if (task.type === 'observation') return 'FileText';
      if (task.type === 'profile-update') return 'User';
      return null;
    };

    const iconName = getIconName();

    return (
      <Button
        {...taskCardStyles.actionButton}
        onPress={handleTaskClick}
        ml="$0"
        isDisabled={isReadOnly || isUploading}
        size={isWeb ? (uiConfig.showAsCard ? "sm" : "md") : "xs"}
        borderRadius="$lg"
        borderColor={buttonStyles.borderColor}
        opacity={isReadOnly || isUploading ? 0.5 : 1}
        $hover-bg={isEdit ? buttonStyles.hoverBg : 'transparent'}
        $hover-borderColor="$primary500"
      >
        {(state: any) => {
          const isHovered = state?.hovered || state?.pressed || false;
          return (
            <HStack space="xs" alignItems="center">
              {iconName && (
                <LucideIcon
                  name={iconName}
                  size={16}
                  color={isHovered ? theme.tokens.colors.primary500 : theme.tokens.colors.textSecondary}
                />
              )}
              <ButtonText
                {...TYPOGRAPHY.button}
                {...taskCardStyles.actionButtonText}
                fontSize={uiConfig.showAsCard || !isWeb ? '$xs' : undefined}
                color={isHovered ? '$primary500' : '$textPrimary'}
              >
                {getButtonText()}
              </ButtonText>
            </HStack>
          );
        }}
      </Button>
    );
  };

  // Render divider
  const renderDivider = () => {
    if (isLastTask) return null;
    return (
      <Box
        {...taskCardStyles.divider}
        marginVertical={!isWeb ? "$2" : (isChildOfProject && isPreview ? '$1' : undefined)}
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
      existingAttachments={task.attachments}
      onUpload={(method) => {
        // console.log('Upload method selected:', method);
      }}
      onConfirm={(files) => {
        handleStatusChange(task._id, TASK_STATUS.COMPLETED);
        // If files were passed, update the task with them
        if (files) {
          updateTask(task._id, { attachments: files });
        }
        setShowUploadModal(false);
        // Show success toast with task-specific message
        const toastMessage = task.name === 'Capture Consent'
          ? t('projectPlayer.consentUploaded')
          : task.name === 'Upload SLA Form'
            ? t('projectPlayer.slaUploaded')
            : t('projectPlayer.evidenceUploaded');
        showSuccessToast(toastMessage);
      }}
    />
  );

  // Render evidence preview modal (for viewing uploaded files in Edit mode)
  const renderPreviewModal = () => (
    <EvidencePreviewModal
      isOpen={showPreviewModal}
      onClose={() => setShowPreviewModal(false)}
      taskName={task.name}
      attachments={task.attachments || []}
    />
  );

  // Main Render Logic

  if (uiConfig.showAsCard) {
    return (
      <>
        <Card
          {...taskCardStyles.childCard}
          bg={
            (isEdit && !isPreview && task.type === 'observation')
              ? '$observationTaskBg'
              : isPreview && isAddedToPlan
                ? '$addedToPlanBg'
                : taskCardStyles.childCard?.bg
          }
          borderColor={
            (isEdit && !isPreview && task.type === 'observation')
              ? '$observationTaskBorder'
              : isPreview && isAddedToPlan
                ? '$addedToPlanBorder'
                : taskCardStyles.childCard?.borderColor
          }
        >
          <Box {...taskCardStyles.childCardContent}>
            {isWeb ? (
              // Web: All in one row
              <HStack alignItems="flex-start" space="md">
                <Box flexShrink={0} alignItems="center" justifyContent="center">
                  {renderStatusIndicator()}
                </Box>
                <Box flex={1} minWidth="$0">
                  {renderTaskInfo()}
                </Box>
                <Box flexShrink={0}>
                  <HStack space="xs" alignItems="center">
                    {renderActionButton()}
                    {renderCustomTaskActions({
                      isCustomTask: task.isCustomTask || false,
                      onEdit: openEditModal,
                      onDelete: openDeleteModal,
                    })}
                  </HStack>
                </Box>
              </HStack>
            ) : (
              // Mobile: Title/badge on top, button below
              <VStack space="sm">
                <HStack alignItems="flex-start" space="sm">
                  <Box flexShrink={0} alignItems="center" justifyContent="center">
                    {renderStatusIndicator()}
                  </Box>
                  <Box flex={1}>
                    {renderTaskInfo()}
                  </Box>
                </HStack>
                <Box alignItems="center" width="100%">
                  <HStack space="xs" alignItems="center">
                    {renderActionButton()}
                    {renderCustomTaskActions({
                      isCustomTask: task.isCustomTask || false,
                      onEdit: openEditModal,
                      onDelete: openDeleteModal,
                    })}
                  </HStack>
                </Box>
              </VStack>
            )}
          </Box>
        </Card>
        {renderUploadModal()}
        {renderPreviewModal()}
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
        <HStack
          {...taskCardStyles.previewInlineContainer}
          padding={isWeb ? "$4" : "$0"}
          bg={isAddedToPlan ? '$addedToPlanBg' : 'transparent'}
          borderColor={isAddedToPlan ? '$addedToPlanBorder' : 'transparent'}
          borderWidth={isAddedToPlan ? 1 : 0}
          borderRadius="$lg"
          marginBottom="$2"
          alignItems="flex-start"
          space={isWeb ? "md" : "xs"}
        >
          <Box flexShrink={0} mt="$1">
            {renderStatusIndicator()}
          </Box>
          <Box flex={1} minWidth={isWeb ? "$0" : undefined}>
            {renderTaskInfo()}
          </Box>
          <Box flexShrink={0}>
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
      <Box {...taskCardStyles.regularTaskContainer} padding={isWeb ? "$5" : "$2"} marginLeft={level * (isWeb ? 16 : 8)}>
        <HStack alignItems="flex-start" space={isWeb ? "md" : "sm"}>
          <Box flexShrink={0} mt="$1">
            {renderStatusIndicator()}
          </Box>
          <Box flex={1} minWidth={isWeb ? "$0" : undefined}>
            {renderTaskInfo()}
          </Box>
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
