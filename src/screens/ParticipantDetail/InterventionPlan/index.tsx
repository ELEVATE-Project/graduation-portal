import React, { useState } from 'react';
import { Box, VStack, Text, Button, ButtonText, HStack } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
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
  const [showPlayer, setShowPlayer] = useState(false);
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
  let configData: ProjectPlayerConfig;
  let projectData: ProjectData;

  // Configure based on status
  // ... (rest of configuration logic same as before) ...
  if (participantStatus === STATUS.ENROLLED && isEditMode) {
    configData = {
      mode: 'edit',
      solutionId: 'sol-community-health-001',
      projectId: 'proj-graduation',
      profileInfo: {
        id: participantId || '',
        name: participantName || '',
      },
    };
    projectData = COMPLEX_PROJECT_DATA;
  } else {
    switch (participantStatus) {
      case STATUS.ENROLLED:
        configData = {
          mode: 'preview',
          solutionId: 'sol-community-health-001',
          projectId: 'proj-graduation',
          profileInfo: {
            id: participantId || '',
            name: participantName || '',
          },
        };
        projectData = COMPLEX_PROJECT_DATA;
        break;
      case STATUS.IN_PROGRESS:
        configData = {
          mode: 'edit',
          solutionId: 'sol-community-health-001',
          projectId: 'proj-graduation',
          profileInfo: {
            id: participantId || '',
            name: participantName || '',
          },
        };
        projectData = COMPLEX_PROJECT_DATA;
        break;
      case STATUS.COMPLETED:
      case STATUS.DROPOUT:
        configData = {
          mode: 'read-only',
          solutionId: 'sol-community-health-001',
          projectId: 'proj-graduation',
          profileInfo: {
            id: participantId || '',
            name: participantName || '',
          },
        };
        projectData = COMPLEX_PROJECT_DATA;
        break;
      default:
        configData = {
          mode: 'preview',
          solutionId: 'sol-community-health-001',
          projectId: 'proj-graduation',
          profileInfo: {
            id: participantId || '',
            name: participantName || '',
          },
        };
        projectData = COMPLEX_PROJECT_DATA;
    }
  }

  const ProjectPlayerConfigData: ProjectPlayerData = {
    solutionId: configData.solutionId,
    projectId: 'projectId' in configData ? configData.projectId : undefined,
    localData: projectData,
  };

  // For ENROLLED: Show ProjectPlayer in preview mode first, then edit mode on button click
  if (participantStatus === STATUS.ENROLLED) {
    return (
      <Box flex={1}>
        <VStack flex={1}>
          <Box flex={1}>
            <ProjectPlayer config={configData} data={ProjectPlayerConfigData} onTaskUpdate={handleTaskUpdate} />
          </Box>

          {/* Submit Intervention Plan Button - Only show in preview mode */}
          {!isEditMode && (
            <Box
              padding="$4"
              borderTopWidth={1}
              borderTopColor="$borderLight300"
              bg="$backgroundPrimary.light"
            >
              <HStack justifyContent="flex-end" width="$full">
                <Button
                  bg="$primary500"
                  borderRadius="$md"
                  paddingHorizontal="$6"
                  paddingVertical="$3"
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
                    {t(
                      'participantDetail.interventionPlan.submitInterventionPlan',
                    )}
                  </ButtonText>
                </Button>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>
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