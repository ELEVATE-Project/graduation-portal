import React, { useState, useMemo } from 'react';
import { Box, VStack, Text, Button, ButtonText, LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { interventionPlanStyles } from './Styles';
import ProjectPlayer, {
  ProjectPlayerData,
  ProjectPlayerConfig,
} from '../../../project-player/index';
import { Task } from '../../../project-player/types/project.types';
import { COMPLEX_PROJECT_DATA, MODE } from '@constants/PROJECTDATA';
import { STATUS } from '@constants/app.constant';
import type { InterventionPlanProps } from '../../../types/screens';
import { useNavigation } from '@react-navigation/native';

const InterventionPlan: React.FC<InterventionPlanProps> = ({
  participantStatus,
  participantId,
  participantProfile,
}) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [addedTasks, setAddedTasks] = useState<Set<string>>(new Set());

  // Define required optional tasks IDs needed for submission
  const REQUIRED_OPTIONAL_TASKS = ['subtask-sp-003', 'subtask-sp-004'];
  const areAllOptionalTasksAdded = REQUIRED_OPTIONAL_TASKS.every(id =>
    addedTasks.has(id),
  );

  // Handle task update callback from ProjectPlayer
  const handleTaskUpdate = (task: Task) => {
    if (task.metaInformation?.addedToPlan) {
      setAddedTasks(prev => new Set(prev).add(task._id));
    } else {
      setAddedTasks(prev => {
        const next = new Set(prev);
        next.delete(task._id);
        return next;
      });
    }
  };

  // Memoize ProjectPlayer config based on status and edit mode
  const config: ProjectPlayerConfig = useMemo(() => {
    // Handle undefined participantStatus
    if (!participantStatus) {
      return MODE.previewMode;
    }

    // Store in const to ensure TypeScript knows it's defined
    const status = participantStatus;

    // ENROLLED status: use editMode if isEditMode is true, otherwise previewMode
    if (status === STATUS.ENROLLED) {
      const baseConfig = isEditMode ? MODE.editMode : MODE.previewMode;
      const showAddCustomTaskButton =
        status === STATUS.ENROLLED || status === STATUS.IN_PROGRESS;
      // Add submit button config for ENROLLED status in preview mode
      if (!isEditMode) {
        return {
          ...baseConfig,
          profileInfo: participantProfile,
          showSubmitButton: true,
          onSubmitInterventionPlan: () => setIsEditMode(true),
          isSubmitDisabled: !areAllOptionalTasksAdded,
          submitWarningMessage: t(
            'participantDetail.interventionPlan.socialProtectionWarning',
          ),
        };
      }

      return {
        ...baseConfig,
        profileInfo: participantProfile,
        showAddCustomTaskButton,
      };
    }

    // Map other statuses to their respective configs
    const statusConfigMap: Record<string, ProjectPlayerConfig> = {
      [STATUS.IN_PROGRESS]: MODE.editMode,
      [STATUS.COMPLETED]: MODE.editMode,
      [STATUS.DROPOUT]: MODE.readOnlyMode,
    };

    return statusConfigMap[status];
  }, [participantStatus, isEditMode, areAllOptionalTasksAdded, t]);

  // Memoize ProjectPlayer data - all statuses use COMPLEX_PROJECT_DATA
  const projectPlayerData: ProjectPlayerData = useMemo(
    () => ({
      solutionId: config?.solutionId,
      projectId: config?.projectId,
      data: COMPLEX_PROJECT_DATA,
    }),
    [config?.solutionId, config?.projectId],
  );

  // Show empty state for ENROLLED status when player is not shown yet
  if (participantStatus === STATUS.ENROLLED) {
    return (
      <Box {...interventionPlanStyles.container}>
        <VStack {...interventionPlanStyles.content}>
          <Box {...interventionPlanStyles.iconContainer}>
            <LucideIcon
              name="FileText"
              size={48}
              color={interventionPlanStyles.iconColor}
            />
          </Box>
          <Text {...interventionPlanStyles.title}>
            {t('participantDetail.interventionPlan.noPlanAssigned')}
          </Text>
          <Text {...interventionPlanStyles.description}>
            {t('participantDetail.interventionPlan.noPlanDescription')}
          </Text>
          <Button
            {...interventionPlanStyles.button}
            onPress={() => {
              navigation.navigate('template', { id: participantId });
            }}
          >
            <ButtonText {...interventionPlanStyles.buttonText}>
              {t('participantDetail.interventionPlan.developPlan')}
            </ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  // Single ProjectPlayer render point for all statuses
  return (
    <Box flex={1}>
      <ProjectPlayer
        config={config}
        data={projectPlayerData}
        onTaskUpdate={handleTaskUpdate}
      />
    </Box>
  );
};

export default InterventionPlan;
