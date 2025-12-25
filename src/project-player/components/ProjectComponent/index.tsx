import React, { useMemo, useState } from 'react';
import { Box, VStack, Card, ScrollView, Text, HStack, Pressable, useToast, Toast, ToastTitle } from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInfoCard from './ProjectInfoCard';
import TaskComponent from './TaskComponent';
import AddCustomTask from '../Task/AddCustomTask';
import AddCustomTaskModal from '../Task/AddCustomTaskModal';
import { projectComponentStyles } from './Styles';
import Container from '@ui/Container';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';

const ProjectComponent: React.FC = () => {
  const { projectData, mode, config } = useProjectContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousPercent, setPreviousPercent] = useState(0);
  const toast = useToast();
  const { t } = useLanguage();

  if (!projectData) {
    return null;
  }

  // Check if project has children (pillars) - used to distinguish Intervention Plan from Onboarding
  const hasChildren =
    projectData.tasks?.some(
      task => task.type === 'project' && task.children && task.children.length > 0,
    ) || false;

  const isEditMode =
    mode === 'edit' && config.showAddCustomTaskButton !== false;

  // Only show progress bar and +Add Custom Task for projects with pillars (Intervention Plan), not flat tasks (Onboarding)
  const showPillarFeatures = isEditMode && hasChildren;

  // For Preview mode, use the regular AddCustomTask component
  const isPreviewMode = mode === 'preview';

  // Handle Save Progress button click
  const handleSaveProgress = (currentPercent: number) => {
    // Save current percentage as previous
    setPreviousPercent(currentPercent);

    toast.show({
      placement: 'bottom right',
      render: ({ id }) => (
        <Toast nativeID={id} action="success" variant="solid" {...projectComponentStyles.toast}>
          <HStack {...projectComponentStyles.toastContent}>
            <LucideIcon name="CheckCircle" size={18} color={theme.tokens.colors.success500} />
            <ToastTitle color="$textPrimary" {...TYPOGRAPHY.bodySmall} fontWeight="$medium">
              {t('projectPlayer.progressSaved')}
            </ToastTitle>
          </HStack>
        </Toast>
      ),
    });
  };

  // Calculate total progress for Edit mode - each completed task = +3%
  const progressData = useMemo(() => {
    if (!isEditMode) return { percent: 0, completedCount: 0, totalCount: 0 };

    let completedCount = 0;
    let totalCount = 0;

    projectData.tasks?.forEach(pillar => {
      pillar.children?.forEach(task => {
        totalCount++;
        if (task.status === 'completed') {
          completedCount++;
        }
      });
    });

    // Each tick = +3%
    const percent = completedCount * 3;
    return { percent, completedCount, totalCount };
  }, [projectData.tasks, isEditMode]);

  // Calculate tasks updated count
  const tasksUpdatedCount = Math.round(Math.abs(progressData.percent - previousPercent) / 3);

  return (
    <Container {...projectComponentStyles.container}>
      <ScrollView {...projectComponentStyles.scrollView}>
        <Card {...projectComponentStyles.card}>
          <VStack>
            <ProjectInfoCard project={projectData} />

            {/* Pillar features only: Progress bar in Card (for Intervention Plan, not Onboarding) */}
            {showPillarFeatures && (
              <Box {...projectComponentStyles.progressCardContainer}>
                <Card {...projectComponentStyles.progressCard}>
                  <HStack {...projectComponentStyles.progressHeader}>
                    <Text {...TYPOGRAPHY.bodySmall} fontWeight="$medium" color="$textSecondary">
                      {t('projectPlayer.graduationReadiness')}
                    </Text>
                    <Text {...TYPOGRAPHY.bodySmall} fontWeight="$semibold" color="$progressBarFillColor">
                      {progressData.percent}%
                    </Text>
                  </HStack>
                  {/* Progress bar */}
                  <Box {...projectComponentStyles.progressBarBackground}>
                    <Box
                      {...projectComponentStyles.progressBarFill}
                      width={`${Math.min(progressData.percent, 100)}%`}
                    />
                  </Box>
                  <Text {...TYPOGRAPHY.caption} fontWeight="$medium" color="$textSecondary" {...projectComponentStyles.previousProgressText}>
                    {t('projectPlayer.previousProgress', { percent: previousPercent })}
                  </Text>
                </Card>

                {/* Save Progress button - only show when there are unsaved changes */}
                {progressData.percent !== previousPercent && (
                  <Pressable {...projectComponentStyles.saveProgressButton} onPress={() => handleSaveProgress(progressData.percent)}>
                    <HStack {...projectComponentStyles.saveProgressButtonInner}>
                      <LucideIcon
                        name="CheckCircle"
                        size={18}
                        color="white"
                      />
                      <Text
                        {...TYPOGRAPHY.button}
                        fontWeight="$semibold"
                        color="$white"
                      >
                        {t('projectPlayer.saveProgress')} ({tasksUpdatedCount === 1
                          ? t('projectPlayer.taskUpdated', { count: tasksUpdatedCount })
                          : t('projectPlayer.tasksUpdated', { count: tasksUpdatedCount })})
                      </Text>
                    </HStack>
                  </Pressable>
                )}
              </Box>
            )}

            {projectData.tasks?.map((task, index) => (
              <TaskComponent
                key={task._id}
                task={task}
                isLastTask={index === projectData.tasks.length - 1}
              />
            ))}

            {/* Pillar features only: +Add Custom Task button (for Intervention Plan, not Onboarding) */}
            {showPillarFeatures && (
              <Box {...projectComponentStyles.addCustomTaskContainer}>
                <Pressable onPress={() => setIsModalOpen(true)}>
                  {(state: any) => {
                    const isHovered = state?.hovered || state?.pressed || false;
                    return (
                      <Box
                        {...projectComponentStyles.addCustomTaskButton}
                        {...(isHovered ? projectComponentStyles.addCustomTaskButtonHovered : {})}
                      >
                        <HStack space="sm" alignItems="center">
                          <LucideIcon
                            name="Plus"
                            size={18}
                            color={isHovered ? theme.tokens.colors.primary700 : theme.tokens.colors.primary500}
                            strokeWidth={2.5}
                          />
                          <Text
                            {...TYPOGRAPHY.button}
                            color={isHovered ? "$primary700" : "$primary500"}
                            fontWeight="$semibold"
                          >
                            {t('projectPlayer.addCustomTask')}
                          </Text>
                        </HStack>
                      </Box>
                    );
                  }}
                </Pressable>
                <AddCustomTaskModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  mode="add"
                />
              </Box>
            )}
          </VStack>
        </Card>
      </ScrollView>
    </Container>
  );
};
export default ProjectComponent;
