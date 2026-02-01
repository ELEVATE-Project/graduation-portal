import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  ButtonText,
  HStack,
  VStack,
  Text,
  Input,
  InputField,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { LucideIcon, Modal } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import Select from '@ui/Inputs/Select';
import { useProjectContext } from '../../context/ProjectContext';
import { Task } from '../../types/project.types';
import { TASK_STATUS } from '../../../constants/app.constant';
import { addCustomTaskModalStyles } from './Styles';
import { AddCustomTaskModalProps } from 'src/project-player/types';
import { theme } from '@config/theme';
import { usePlatform } from '@utils/platform';
import { SERVICE_PROVIDER_LIST } from '@constants/PROFILE_MENU_OPTIONS';

export const AddCustomTaskModal: React.FC<AddCustomTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  templateId: propPillarId,
  templateName: propPillarName,
  mode = 'add',
}) => {
  const { t } = useLanguage();
  const {
    projectData,
    addTask,
    updateTask,
    mode: playerMode,
  } = useProjectContext();
  const { isWeb } = usePlatform();

  // Form state - merged into single object
  const [formData, setFormData] = useState({
    selectedPillar: '',
    taskName: '',
    instructions: '',
    serviceProvider: '',
  });

  const isEditMode = mode === 'edit' && !!task;
  const isPreviewMode = playerMode === 'preview';

  // Helper to update form field
  const updateFormField = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    [],
  );

  // Helper to reset form
  const resetForm = useCallback(() => {
    setFormData({
      selectedPillar: '',
      taskName: '',
      instructions: '',
      serviceProvider: '',
    });
  }, []);

  // Get all pillars (project type tasks) for the dropdown - memoized
  const pillars = useMemo(
    () =>
      projectData?.tasks
        ?.filter(pillar => pillar.type === 'project')
        .map(pillar => ({
          label: `${pillar.name} (${pillar.children?.length || 0} ${t(
            'projectPlayer.tasks',
          )})`,
          value: pillar._id,
        })) || [],
    [projectData?.tasks, t],
  );

  // Find parent pillar for a task
  const findParentPillar = useCallback(
    (taskId: string): Task | undefined => {
      return projectData?.children?.find(pillar =>
        pillar?.tasks?.some(child => child._id === taskId),
      );
    },
    [projectData],
  );
  // Populate form when editing or set pillar when adding
  useEffect(() => {
    if (isEditMode && task) {
      // Edit mode: populate with existing task data
      const parentPillar = findParentPillar(task._id);
      setFormData({
        selectedPillar: parentPillar?._id || '',
        taskName: task.name,
        instructions: task.description || '',
        serviceProvider: task.serviceProvider || '',
      });
    } else if (propPillarId) {
      // Add mode: set pillar if provided, reset other fields
      setFormData({
        selectedPillar: propPillarId,
        taskName: '',
        instructions: '',
        serviceProvider: '',
      });
    } else {
      // Reset everything if no pillar provided
      resetForm();
    }
  }, [isEditMode, task, propPillarId, findParentPillar, resetForm]);

  const handleCloseModal = useCallback(() => {
    // Reset form when closing (preserve pillar if provided in add mode)
    if (!propPillarId && !isEditMode) {
      resetForm();
    } else {
      setFormData(prev => ({
        ...prev,
        taskName: '',
        instructions: '',
        serviceProvider: '',
      }));
    }
    onClose();
  }, [propPillarId, isEditMode, resetForm, onClose]);

  const handleSubmit = useCallback(() => {
    const { taskName, instructions, serviceProvider, selectedPillar } =
      formData;

    if (isEditMode && task) {
      // Update existing task
      updateTask(task._id, {
        name: taskName,
        description: instructions,
        serviceProvider: serviceProvider || undefined,
      });
    } else {
      // Create new task
      // In preview mode, use propPillarId. In edit mode, use selectedPillar.
      const pillarIdToUse = propPillarId || selectedPillar;
      const newTask: Task = {
        _id: `custom-${Date.now()}`,
        name: taskName,
        description: instructions,
        type: 'simple',
        status: TASK_STATUS.TO_DO,
        isCustomTask: true,
        serviceProvider: serviceProvider || undefined,
      };
      addTask(pillarIdToUse, newTask);
    }
    handleCloseModal();
  }, [
    formData,
    isEditMode,
    task,
    propPillarId,
    updateTask,
    addTask,
    handleCloseModal,
  ]);

  // Form validation: In preview mode, pillar is always provided. In edit mode, need to select pillar.
  const isFormValid = useMemo(
    () =>
      (isPreviewMode || propPillarId || formData.selectedPillar) &&
      formData.taskName.trim(),
    [isPreviewMode, propPillarId, formData.selectedPillar, formData.taskName],
  );

  const parentPillarName =
    propPillarName || findParentPillar(task?._id || '')?.name;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      headerTitle={
        isEditMode
          ? 'projectPlayer.editCustomTask'
          : 'projectPlayer.addCustomTask'
      }
      headerDescription={
        isEditMode
          ? 'projectPlayer.editCustomTaskSubtitle'
          : 'projectPlayer.addCustomTaskSubtitle'
      }
      maxWidth={550}
      footerContent={
        isWeb ? (
          <HStack {...addCustomTaskModalStyles.footerButtons}>
            {/* Cancel Button */}
            <Button
              {...addCustomTaskModalStyles.cancelButton}
              onPress={handleCloseModal}
            >
              <ButtonText color="$textPrimary" {...TYPOGRAPHY.button}>
                {t('common.cancel')}
              </ButtonText>
            </Button>

            {/* Submit Button */}
            <Button
              {...addCustomTaskModalStyles.submitButton}
              onPress={handleSubmit}
              isDisabled={!isFormValid}
              opacity={!isFormValid ? 0.5 : 1}
            >
              <HStack {...addCustomTaskModalStyles.submitButtonContent}>
                <LucideIcon
                  name={isEditMode ? 'Check' : 'Plus'}
                  size={16}
                  color={theme.tokens.colors.backgroundPrimary.light}
                />
                <ButtonText
                  color="$backgroundPrimary.light"
                  {...TYPOGRAPHY.button}
                >
                  {isEditMode
                    ? t('projectPlayer.updateTask')
                    : t('projectPlayer.addCustomTask')}
                </ButtonText>
              </HStack>
            </Button>
          </HStack>
        ) : (
          <VStack space="md" width="$full">
            {/* Submit Button first on mobile */}
            <Button
              {...addCustomTaskModalStyles.submitButton}
              width="$full"
              onPress={handleSubmit}
              isDisabled={!isFormValid}
              opacity={!isFormValid ? 0.5 : 1}
            >
              <HStack {...addCustomTaskModalStyles.submitButtonContent}>
                <LucideIcon
                  name={isEditMode ? 'Check' : 'Plus'}
                  size={16}
                  color={theme.tokens.colors.backgroundPrimary.light}
                />
                <ButtonText
                  color="$backgroundPrimary.light"
                  {...TYPOGRAPHY.button}
                >
                  {isEditMode
                    ? t('projectPlayer.updateTask')
                    : t('projectPlayer.addCustomTask')}
                </ButtonText>
              </HStack>
            </Button>

            {/* Cancel Button */}
            <Button
              {...addCustomTaskModalStyles.cancelButton}
              width="$full"
              onPress={handleCloseModal}
            >
              <ButtonText color="$textPrimary" {...TYPOGRAPHY.button}>
                {t('common.cancel')}
              </ButtonText>
            </Button>
          </VStack>
        )
      }
    >
      {/* Modal Body - Form Fields */}
      <VStack {...addCustomTaskModalStyles.formStack}>
        {/* Select Pillar */}
        <VStack {...addCustomTaskModalStyles.fieldStack}>
          {/* Label */}
          <Text {...TYPOGRAPHY.label} color="$textPrimary" fontWeight="$medium">
            {!isPreviewMode && (
              <>
                {t('projectPlayer.selectPillar')}
                <Text color="$error500">*</Text>
              </>
            )}
          </Text>

          {/* Preview Mode → show Pillar: Pillar Name in one line */}
          {isPreviewMode ? (
            <HStack space="xs">
              <Text
                {...TYPOGRAPHY.paragraph}
                color="$textPrimary"
                fontWeight="$medium"
              >
                {t('projectPlayer.pillar')}:
              </Text>
              <Text {...TYPOGRAPHY.paragraph} color="$textPrimary">
                {parentPillarName || propPillarName}
              </Text>
            </HStack>
          ) : propPillarId || isEditMode ? (
            <Text {...TYPOGRAPHY.paragraph} color="$textPrimary">
              {parentPillarName || propPillarName}
            </Text>
          ) : (
            <Select
              options={pillars}
              value={formData.selectedPillar}
              onChange={value => updateFormField('selectedPillar', value)}
              placeholder={t('projectPlayer.selectPillarPlaceholder')}
              {...addCustomTaskModalStyles.select}
            />
          )}
        </VStack>

        {/* Task Name */}
        <VStack {...addCustomTaskModalStyles.fieldStack}>
          <Text {...TYPOGRAPHY.label} color="$textPrimary" fontWeight="$medium">
            {t('projectPlayer.taskName')} <Text color="$error500">*</Text>
          </Text>
          <Input {...addCustomTaskModalStyles.input}>
            <InputField
              placeholder={t('projectPlayer.taskNamePlaceholder')}
              value={formData.taskName}
              onChangeText={value => updateFormField('taskName', value)}
              placeholderTextColor="$textMuted"
            />
          </Input>
        </VStack>

        {/* Instructions */}
        <VStack {...addCustomTaskModalStyles.fieldStack}>
          <Text {...TYPOGRAPHY.label} color="$textPrimary" fontWeight="$medium">
            {t('projectPlayer.instructions')}
          </Text>
          <Textarea {...addCustomTaskModalStyles.textarea}>
            <TextareaInput
              placeholder={t('projectPlayer.instructionsPlaceholder')}
              value={formData.instructions}
              onChangeText={value => updateFormField('instructions', value)}
              placeholderTextColor="$textMuted"
            />
          </Textarea>
        </VStack>

        {/* Service Provider Selection (Optional) */}
        <VStack {...addCustomTaskModalStyles.serviceProviderSection}>
          <HStack {...addCustomTaskModalStyles.serviceProviderHeader}>
            <LucideIcon
              name="Building2"
              size={16}
              color={theme.tokens.colors.primary500}
            />
            <Text
              {...TYPOGRAPHY.label}
              color="$textPrimary"
              fontWeight="$medium"
            >
              {t('projectPlayer.serviceProviderSelection')}
            </Text>
          </HStack>
          <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
            {t('projectPlayer.serviceProvider')}
          </Text>
          <Select
            options={SERVICE_PROVIDER_LIST}
            value={formData.serviceProvider}
            onChange={value => updateFormField('serviceProvider', value)}
            placeholder={t('projectPlayer.selectServiceProvider')}
            {...addCustomTaskModalStyles.select}
          />
        </VStack>
      </VStack>
    </Modal>
  );
};

export default AddCustomTaskModal;
