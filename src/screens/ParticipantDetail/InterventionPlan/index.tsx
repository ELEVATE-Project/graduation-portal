import React, { useState } from 'react';
import { Box, VStack, Button, ButtonText, HStack, Text, LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { usePlatform } from '@utils/platform';
import { interventionPlanStyles } from './Styles';
import ProjectPlayer, {
  ProjectPlayerData,
  ProjectPlayerConfig,
} from '../../../project-player/index';
import { ProjectData, Task } from '../../../project-player/types/project.types';
import {
  COMPLEX_PROJECT_DATA,
  PROJECT_PLAYER_CONFIGS,
} from '@constants/PROJECTDATA';
import { STATUS } from '@constants/app.constant';
import type { InterventionPlanProps } from '../../../types/screens';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

const InterventionPlan: React.FC<InterventionPlanProps> = ({
  participantStatus,
  participantId,
  participantName,
}) => {
  const { t } = useLanguage();
  const { isWeb } = usePlatform();
  const [isEditMode, setIsEditMode] = useState(false);
  const [addedTasks, setAddedTasks] = useState<Set<string>>(new Set());

  // Define required optional tasks IDs needed for submission
  const REQUIRED_OPTIONAL_TASKS = ['subtask-sp-003', 'subtask-sp-004'];
  const areAllOptionalTasksAdded = REQUIRED_OPTIONAL_TASKS.every(id => addedTasks.has(id));

  const handleTaskUpdate = (task: Task) => {
    if (task.metadata?.addedToPlan) {
      setAddedTasks(prev => new Set(prev).add(task._id));
    } else {
      setAddedTasks(prev => {
        const next = new Set(prev);
        next.delete(task._id);
        return next;
      });
    }
  };

  // Determine ProjectPlayer config and data based on participant status
  // Base config shared across all statuses
  const baseConfig = {
    solutionId: 'sol-community-health-001',
    projectId: 'proj-graduation',
    profileInfo: {
      id: participantId || '',
      name: participantName || '',
    },
  };

  // Determine mode based on status
  const getMode = (): 'preview' | 'edit' | 'read-only' => {
    if (participantStatus === STATUS.ENROLLED && isEditMode) return 'edit';
    if (participantStatus === STATUS.ENROLLED) return 'preview';
    if (participantStatus === STATUS.IN_PROGRESS) return 'edit';
    if (participantStatus === STATUS.COMPLETED || participantStatus === STATUS.DROPOUT) return 'read-only';
    return 'preview'; // default
  };

  const configData: ProjectPlayerConfig = {
    mode: getMode(),
    ...baseConfig,
  };

  const ProjectPlayerConfigData: ProjectPlayerData = {
    solutionId: configData.solutionId,
    projectId: 'projectId' in configData ? configData.projectId : undefined,
    localData: COMPLEX_PROJECT_DATA,
  };

  // For ENROLLED: Show ProjectPlayer in preview mode first, then edit mode on button click
  if (participantStatus === STATUS.ENROLLED) {
    return (
      <Box flex={1}>
        <VStack flex={1}>
          <Box flex={1}>
            <ProjectPlayer config={configData} data={ProjectPlayerConfigData} onTaskUpdate={handleTaskUpdate} />
          </Box>

          {/* Footer - Only show in preview mode */}
          {!isEditMode && (
            <VStack
              space="md"
              padding="$4"
              borderTopWidth={1}
              borderTopColor="$borderLight300"
              bg="$backgroundPrimary.light"
            >
              {/* Warning Banner - Show when Social Protection tasks need attention */}
              {!areAllOptionalTasksAdded && (
                <Box
                  bg="$warning50"
                  borderWidth={1}
                  borderColor="$warning300"
                  borderRadius="$md"
                  padding="$3"
                >
                  <HStack space="sm" alignItems="center">
                    <LucideIcon name="AlertCircle" size={18} color="#ca8a04" />
                    <Text fontSize="$sm" color="$warning700">
                      {t('participantDetail.interventionPlan.socialProtectionWarning')}
                    </Text>
                  </HStack>
                </Box>
              )}

              {/* Footer Buttons - Horizontal on web, vertical on mobile */}
              {isWeb ? (
                <HStack justifyContent="space-between" width="$full">
                  {/* Change Pathway Button */}
                  <Button
                    variant="outline"
                    borderColor="$borderLight300"
                    borderRadius="$md"
                    paddingHorizontal="$4"
                    paddingVertical="$2"
                    onPress={() => {
                      // TODO: Implement change pathway functionality
                    }}
                    $hover-borderColor="$primary500"
                    $hover-bg="$error50"
                  >
                    <ButtonText
                      color="$textPrimary"
                      {...TYPOGRAPHY.button}
                      fontWeight="$medium"
                    >
                      {t('participantDetail.interventionPlan.changePathway')}
                    </ButtonText>
                  </Button>

                  {/* Submit Intervention Plan Button */}
                  <Button
                    bg="$primary500"
                    borderRadius="$md"
                    paddingHorizontal="$6"
                    paddingVertical="$2"
                    onPress={() => setIsEditMode(true)}
                    isDisabled={!areAllOptionalTasksAdded}
                    opacity={!areAllOptionalTasksAdded ? 0.5 : 1}
                    $hover-bg="$primary600"
                    $web-cursor="pointer"
                  >
                    <ButtonText
                      color="$backgroundPrimary.light"
                      {...TYPOGRAPHY.button}
                      fontWeight="$semibold"
                    >
                      {t('participantDetail.interventionPlan.submitInterventionPlan')}
                    </ButtonText>
                  </Button>
                </HStack>
              ) : (
                <VStack space="md" width="$full">
                  {/* Change Pathway Button */}
                  <Button
                    variant="outline"
                    borderColor="$borderLight300"
                    borderRadius="$md"
                    paddingVertical="$2"
                    width="$full"
                    onPress={() => {
                      // TODO: Implement change pathway functionality
                    }}
                  >
                    <ButtonText
                      color="$textPrimary"
                      {...TYPOGRAPHY.button}
                      fontWeight="$medium"
                    >
                      {t('participantDetail.interventionPlan.changePathway')}
                    </ButtonText>
                  </Button>

                  {/* Submit Intervention Plan Button */}
                  <Button
                    bg="$primary500"
                    borderRadius="$md"
                    paddingVertical="$2"
                    width="$full"
                    onPress={() => setIsEditMode(true)}
                    isDisabled={!areAllOptionalTasksAdded}
                    opacity={!areAllOptionalTasksAdded ? 0.5 : 1}
                  >
                    <ButtonText
                      color="$backgroundPrimary.light"
                      {...TYPOGRAPHY.button}
                      fontWeight="$semibold"
                    >
                      {t('participantDetail.interventionPlan.submitInterventionPlan')}
                    </ButtonText>
                  </Button>
                </VStack>
              )}
            </VStack>
          )}
        </VStack>
      </Box >
    );
  }


  // For other statuses: Show ProjectPlayer directly
  return (
    <Box flex={1}>
      <ProjectPlayer config={configData} data={ProjectPlayerConfigData} onTaskUpdate={handleTaskUpdate} />
    </Box>
  );
};

export default InterventionPlan;