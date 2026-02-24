import React, { useState } from 'react';
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
} from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInfoCard from './ProjectInfoCard';
import TaskComponent from './TaskComponent';
import AddCustomTaskModal from '../Task/AddCustomTaskModal';
import { projectComponentStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import Container from '@ui/Container';
import { LucideIcon, useAlert } from '@ui';
import { theme } from '@config/theme';
import { submitInterventionPlan } from '../../services/projectPlayerService';
import { addCustomTaskStyles } from '../Task/Styles';

const ProjectComponent: React.FC = () => {
  const {
    projectData,
    mode,
    config,
    addedToPlanTaskIds,
    taskPlanActionPerformedIds,
  } =
    useProjectContext();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useAlert();

  const hasChildren = !!projectData?.children?.length || projectData?.tasks?.some(task => !!task.children?.length);

  const isEditMode =
    mode === 'edit' && config.showAddCustomTaskButton !== false;

  // Only show progress bar and +Add Custom Task for projects with pillars (Intervention Plan), not flat tasks (Onboarding)
  const showPillarFeatures = isEditMode && hasChildren;

  const shouldShowSubmitButton = config.showSubmitButton && mode === 'preview';

  const getExcludedTaskIds = (
    tasks: any[] = [],
    addedToPlanSet: Set<string>,
  ): string[] => {
    return tasks.flatMap(task => {
      const nested = [
        ...(task.name === 'Social Protection' && task.tasks
          ? getExcludedTaskIds(task.tasks, addedToPlanSet)
          : []),
      ];
      const isOptional = task?.isDeletable === true;
      const isAddedToPlan = addedToPlanSet.has(task._id);
      const excluded = isOptional && !isAddedToPlan ? [task._id] : [];
      return [...excluded, ...nested];
    });
  };

  const getDeletableTaskIds = (tasks: any[] = []): string[] => {
    return tasks.flatMap(task => {
      const nested = [
        ...(task.name === 'Social Protection' && task.tasks
          ? getDeletableTaskIds(task.tasks)
          : []),
      ];
      const isDeletable = task?.isDeletable === true;
      return [...(isDeletable ? [task._id] : []), ...nested];
    });
  };

  const onSubmitInterventionPlan = async () => {
    if (!projectData) return;

    try {
      // Collect all custom tasks grouped by template/pillar
      const templates: Array<{
        templateId: string;
        targetTaskName?: string;
        targetProjectName?: string;
        customTasks: Array<{
          name: string;
          description: string;
          type: string;
        }>;
      }> = [];

      // Process children (templates/pillars)
      if (projectData.children && projectData.children.length > 0) {
        projectData.children.forEach((pillar: any) => {
          // Get custom tasks from this pillar (check both tasks and children properties)
          const pillarTasks = pillar.tasks || pillar.children || [];
          const customTasks = pillarTasks
            .filter((task: any) => task.isCustomTask === true)
            .map((task: any) => ({
              name: task.name,
              description: task.description || '',
              type: 'simple', // Map 'simple' to 'single' as per API requirement
            }));

          // Determine if this is a task or project based on type
          const isProject = pillar.type === 'project';

          templates.push({
            templateId: pillar.templateId,
            ...(isProject
              ? { targetProjectName: pillar.name }
              : { targetTaskName: pillar.name }),
            customTasks,
          });
        });
      }

      // Format the payload
      const userId = config.profileInfo?.id?.toString();
      if (!userId) {
        showAlert('error', t('projectPlayer.error.participantIdMissing'), {
          placement: 'top',
        });
        return;
      }

      const excludedTaskIds = Array.from(
        new Set(
          getExcludedTaskIds(
            [
              ...(projectData.children || []),
            ],
            new Set(addedToPlanTaskIds),
          ),
        ),
      );

      const reqBody = {
        templates,
        userId,
        entityId: config.profileInfo?.entityId || userId, // Fallback to userId if entityId not available
        projectConfig: { referenceFrom: process.env.GLOBAL_LC_PROGRAM_ID },
        excludedTaskIds,
      };

      // Call API to submit intervention plan
      const response = await submitInterventionPlan(reqBody);
      const newProjectId = response?.data?.projectId
      if (!response.error) {
        showAlert('success', t('template.IdpCreationSuccess'), {
          placement: 'top',
        });

        // Call the config callback if provided (this will update status to IN_PROGRESS)
        if (config.onSubmitInterventionPlan) {
          config.onSubmitInterventionPlan(newProjectId);
        }
      } else {
        showAlert(
          'error',
          response.error || t('projectPlayer.error.submitFailed'),
          {
            placement: 'top',
          },
        );
      }
    } catch (error) {
      console.error('Error submitting intervention plan:', error);
      showAlert('error', t('projectPlayer.error.submitFailed'), {
        placement: 'top',
      });
    }
  };

  if (!projectData) {
    return null;
  }

  return (
    <Container {...projectComponentStyles.container}>
      <VStack flex={1}>
        <ScrollView {...projectComponentStyles.scrollView}>
          <Card
            {...projectComponentStyles.card}
            {...(hasChildren ? {} : projectComponentStyles.onboardingCard)}
          >
            <VStack>
              <ProjectInfoCard project={projectData} />

              {hasChildren
                ? projectData?.children?.length
                  ? projectData?.children.map(task => (
                    <TaskComponent
                      key={task?._id}
                      task={task}
                      isChildOfProject={true}
                    />
                  ))
                  : projectData?.tasks
                    ?.filter(task => task.children?.length)
                    ?.map(task => (
                      <TaskComponent
                        key={task._id}
                        task={task}
                        isChildOfProject={true}
                      />
                    ))
                : (
                  <Box paddingHorizontal="$5" paddingTop="$2" paddingBottom="$4">
                    {projectData?.tasks?.map((task, index) => (
                      <TaskComponent
                        key={task._id}
                        task={task}
                        isLastTask={
                          index === (projectData.tasks?.length || 0) - 1
                        }
                        isOnboardingTask={true}
                      />
                    ))}
                  </Box>
                )}

              {/* Pillar features only: +Add Custom Task button (for Intervention Plan, not Onboarding) */}
              {showPillarFeatures && (
                <Box {...projectComponentStyles.addCustomTaskContainer}>
                  <Pressable onPress={() => setIsModalOpen(true)}>
                    {(state: any) => {
                      const isHovered =
                        state?.hovered || state?.pressed || false;
                      return (
                        <Box
                          {...addCustomTaskStyles.buttonBox}
                          bg={isHovered ? '$primary100' : '$accent100'}
                          borderColor={
                            isHovered ? '$primary500' : '$mutedBorder'
                          }
                        >
                          <HStack {...addCustomTaskStyles.buttonContent}>
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
                              {t('projectPlayer.addTaskToPillar')}
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

        {/* Footer with Change Pathway and Submit Intervention Plan Buttons */}
        {shouldShowSubmitButton && (
          <VStack
            space="md"
            padding="$4"
            borderTopWidth={1}
            borderTopColor="$borderLight300"
            bg="$backgroundPrimary.light"
          >
            {(() => {
              const deletableTaskIds = getDeletableTaskIds(
                projectData.children || [],
              );
              const allActionsCompleted = deletableTaskIds.every(id =>
                taskPlanActionPerformedIds.includes(id),
              );
              const isSubmitDisabled =
                config.isSubmitDisabled || !allActionsCompleted;

              return (
                <>
            {/* Warning Banner - Show when Submit is disabled */}
            {isSubmitDisabled && config.submitWarningMessage && (
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
                  if (config.onChangePathway) {
                    config.onChangePathway();
                    return;
                  }
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
                onPress={onSubmitInterventionPlan}
                isDisabled={isSubmitDisabled}
                opacity={isSubmitDisabled ? 0.5 : 1}
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
                </>
              );
            })()}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};
export default ProjectComponent;
