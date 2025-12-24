import React from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Progress,
  ProgressFilledTrack,
} from '@gluestack-ui/themed';
import { ProjectInfoCardProps } from '../../types/components.types';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useProjectContext } from '../../context/ProjectContext';
import { useLanguage } from '@contexts/LanguageContext';
import { projectInfoCardStyles } from './Styles';
import { TASK_STATUS } from '@constants/app.constant';

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project }) => {
  const { mode } = useProjectContext();
  const { t } = useLanguage();

  const completedTasks =
    project.tasks?.filter(task => task.status === TASK_STATUS.COMPLETED)
      .length || 0;
  const totalTasks = project.tasks?.length || 0;

  // Check if any task is a project type (has children)
  const hasChildren =
    project.tasks?.some(
      task =>
        task.type === 'project' && task.children && task.children.length > 0,
    ) || false;

  // Count total pillars (project type tasks)
  const totalPillars =
    project.tasks?.filter(task => task.type === 'project').length || 0;

  // Count total child tasks across all pillars
  const totalChildTasks =
    project.tasks?.reduce((acc, task) => {
      if (task.type === 'project' && task.children) {
        return acc + task.children.length;
      }
      return acc;
    }, 0) || 0;

  const isPreview = mode === 'preview';
  const isEditOrReadOnly = mode === 'edit' || mode === 'read-only';

  // Calculate progress percentage
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Box {...projectInfoCardStyles.container}>
      <HStack {...projectInfoCardStyles.header}>
        <VStack {...projectInfoCardStyles.leftSection}>
          <Text {...TYPOGRAPHY.h3} color="$textPrimary">
            {project.name}
          </Text>

          {project.description && (
            <Text
              {...TYPOGRAPHY.paragraph}
              color="$textSecondary"
              lineHeight="$lg"
            >
              {project.description}
            </Text>
          )}
        </VStack>

        {!hasChildren && (
          <Box {...projectInfoCardStyles.stepsCompleteBadge}>
            <HStack {...projectInfoCardStyles.stepsCompleteText}>
              <Text
                {...TYPOGRAPHY.caption}
                color="$modalBackground"
                fontWeight="$semibold"
              >
                {completedTasks} of {totalTasks}{' '}
                {t('projectPlayer.stepsComplete')}
              </Text>
            </HStack>
          </Box>
        )}

        {!hasChildren && isPreview && (
          <Box {...projectInfoCardStyles.taskCountPreview}>
            <Text {...TYPOGRAPHY.caption} color="$primary500">
              {totalTasks} {t('projectPlayer.tasks')}
            </Text>
          </Box>
        )}



        {hasChildren && isPreview && (
          <VStack {...projectInfoCardStyles.pillarsCountContainer}>
            <Text {...TYPOGRAPHY.caption} color="$primary500">
              {totalPillars} {t('projectPlayer.pillars')}
            </Text>
            <Text {...TYPOGRAPHY.caption} color="$primary500">
              {totalChildTasks} {t('projectPlayer.tasks')}
            </Text>
          </VStack>
        )}
      </HStack>
    </Box>
  );
};

export default ProjectInfoCard;
