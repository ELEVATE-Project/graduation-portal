import React, { useMemo, useState } from 'react';
import {
  Box,
  VStack,
  Card,
  ScrollView,
  Button,
  ButtonText,
  HStack,
  Text,
  Pressable,
  useToast,
  Toast,
  ToastTitle,
} from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInfoCard from './ProjectInfoCard';
import TaskComponent from './TaskComponent';
import AddCustomTask from '../Task/AddCustomTask';
import AddCustomTaskModal from '../Task/AddCustomTaskModal';
import { projectComponentStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import Container from '@ui/Container';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';
import { TASK_STATUS } from '@constants/app.constant';

const ProjectComponent: React.FC = () => {
  const { projectData, mode, config } = useProjectContext();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousPercent, setPreviousPercent] = useState(0);
  const toast = useToast();

  const hasChildren = !!projectData?.children?.length;

  const isEditMode =
    mode === 'edit' && config.showAddCustomTaskButton !== false;

  // Only show progress bar and +Add Custom Task for projects with pillars (Intervention Plan), not flat tasks (Onboarding)
  const showPillarFeatures = isEditMode && hasChildren;

  const shouldShowSubmitButton =
    config.showSubmitButton &&
    mode === 'preview' &&
    config.onSubmitInterventionPlan;

  // Handle Save Progress button click
  const handleSaveProgress = (currentPercent: number) => {
    // Save current percentage as previous
    setPreviousPercent(currentPercent);

    toast.show({
      placement: 'bottom right',
      render: ({ id }) => (
        <Toast
          nativeID={id}
          action="success"
          variant="solid"
          {...projectComponentStyles.toast}
        >
          <HStack {...projectComponentStyles.toastContent}>
            <LucideIcon
              name="CheckCircle"
              size={18}
              color={theme.tokens.colors.success600}
            />
            <ToastTitle
              color="$textPrimary"
              {...TYPOGRAPHY.bodySmall}
              fontWeight="$medium"
            >
              {t('projectPlayer.progressSaved')}
            </ToastTitle>
          </HStack>
        </Toast>
      ),
    });
  };

  // Calculate total progress for Edit mode - each completed task = +3%
  const progressData = useMemo(() => {
    if (!isEditMode || !projectData)
      return { percent: 0, completedCount: 0, totalCount: 0 };

    let completedCount = 0;
    let totalCount = 0;

    projectData?.tasks?.forEach(pillar => {
      pillar.children?.forEach(task => {
        totalCount++;
        if (task.status === TASK_STATUS.COMPLETED) {
          completedCount++;
        }
      });
    });

    // Each tick = +3%, capped at 100%
    const percent = Math.min(completedCount * 3, 100);
    return { percent, completedCount, totalCount };
  }, [projectData?.tasks, isEditMode]);

  // Calculate tasks updated count
  const tasksUpdatedCount = Math.round(
    Math.abs(progressData.percent - previousPercent) / 3,
  );

  if (!projectData) {
    return null;
  }

  return (
    <Container {...projectComponentStyles.container}>
      <VStack flex={1}>
        <ScrollView {...projectComponentStyles.scrollView}>
          <Card {...projectComponentStyles.card}>
            <VStack>
              <ProjectInfoCard project={projectData} />

              {/* Pillar features only: Progress bar in Card (for Intervention Plan, not Onboarding) */}
              {showPillarFeatures && (
                <Box {...projectComponentStyles.progressCardContainer}>
                  <Card {...projectComponentStyles.progressCard}>
                    <HStack {...projectComponentStyles.progressHeader}>
                      <Text
                        {...TYPOGRAPHY.bodySmall}
                        fontWeight="$medium"
                        color="$textSecondary"
                      >
                        {t('projectPlayer.graduationReadiness')}
                      </Text>
                      <Text
                        {...TYPOGRAPHY.bodySmall}
                        fontWeight="$semibold"
                        color="$progressBarFillColor"
                      >
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
                    <Text
                      {...TYPOGRAPHY.caption}
                      fontWeight="$medium"
                      color="$textSecondary"
                      {...projectComponentStyles.previousProgressText}
                    >
                      {t('projectPlayer.previousProgress', {
                        percent: previousPercent,
                      })}
                    </Text>
                  </Card>

                  {/* Save Progress button - only show when there are unsaved changes */}
                  {progressData.percent !== previousPercent && (
                    <Pressable
                      {...projectComponentStyles.saveProgressButton}
                      onPress={() => handleSaveProgress(progressData.percent)}
                    >
                      <HStack
                        {...projectComponentStyles.saveProgressButtonInner}
                      >
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
                          {t('projectPlayer.saveProgress')} (
                          {tasksUpdatedCount === 1
                            ? t('projectPlayer.taskUpdated', {
                                count: tasksUpdatedCount,
                              })
                            : t('projectPlayer.tasksUpdated', {
                                count: tasksUpdatedCount,
                              })}
                          )
                        </Text>
                      </HStack>
                    </Pressable>
                  )}
                </Box>
              )}

              {hasChildren
                ? projectData?.children?.map((task, index) => (
                    <TaskComponent
                      key={task._id}
                      task={task}
                      // isLastTask={index === projectData.children.length - 1}
                    />
                  ))
                : projectData?.tasks?.map((task, index) => (
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
                      const isHovered =
                        state?.hovered || state?.pressed || false;
                      return (
                        <Box
                          {...projectComponentStyles.addCustomTaskButton}
                          {...(isHovered
                            ? projectComponentStyles.addCustomTaskButtonHovered
                            : {})}
                        >
                          <HStack space="sm" alignItems="center">
                            <LucideIcon
                              name="Plus"
                              size={18}
                              color={
                                isHovered
                                  ? theme.tokens.colors.primary700
                                  : theme.tokens.colors.primary500
                              }
                              strokeWidth={2.5}
                            />
                            <Text
                              {...TYPOGRAPHY.button}
                              color={isHovered ? '$primary700' : '$primary500'}
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

        {isEditMode && !showPillarFeatures && (
          <Box {...projectComponentStyles.addTaskButtonContainer}>
            <AddCustomTask />
          </Box>
        )}

        {/* Footer with Change Pathway and Submit Intervention Plan Buttons */}
        {shouldShowSubmitButton && (
          <VStack
            space="md"
            padding="$4"
            borderTopWidth={1}
            borderTopColor="$borderLight300"
            bg="$backgroundPrimary.light"
          >
            {/* Warning Banner - Show when Submit is disabled */}
            {config.isSubmitDisabled && config.submitWarningMessage && (
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
                    {config.submitWarningMessage}
                  </Text>
                </HStack>
              </Box>
            )}

            {/* Responsive Button Container - stacks on mobile, row on web */}
            <Box {...projectComponentStyles.footerButtonContainer}>
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
                {...projectComponentStyles.changePathwayButton}
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
                onPress={config.onSubmitInterventionPlan}
                isDisabled={config.isSubmitDisabled}
                opacity={config.isSubmitDisabled ? 0.5 : 1}
                $hover-bg="$primary600"
                $web-cursor="pointer"
                {...projectComponentStyles.submitButton}
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
            </Box>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};
export default ProjectComponent;
