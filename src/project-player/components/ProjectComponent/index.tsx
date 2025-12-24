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

const ProjectComponent: React.FC = () => {
  const { projectData, mode, config } = useProjectContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousPercent, setPreviousPercent] = useState(0);
  const toast = useToast();

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
        <Toast nativeID={id} action="success" variant="solid" bg="$backgroundLight100" borderRadius="$lg" marginBottom="$4" marginRight="$4">
          <HStack space="sm" alignItems="center" padding="$2">
            <LucideIcon name="CheckCircle" size={18} color={theme.tokens.colors.success500} />
            <ToastTitle color="$textPrimary" fontSize="$sm" fontWeight="$medium">
              Progress saved successfully
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

  return (
    <Container {...projectComponentStyles.container}>
      <ScrollView {...projectComponentStyles.scrollView}>
        <Card {...projectComponentStyles.card}>
          <VStack>
            <ProjectInfoCard project={projectData} />

            {/* Pillar features only: Progress bar in Card (for Intervention Plan, not Onboarding) */}
            {showPillarFeatures && (
              <Box paddingHorizontal="$5" paddingVertical="$4">
                <Card
                  borderWidth={1}
                  borderColor="$borderLight200"
                  borderRadius="$lg"
                  padding="$4"
                  bg="$white"
                >
                  <HStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                    <Text fontSize="$sm" fontWeight="$medium" color="$textSecondary">
                      Graduation Readiness
                    </Text>
                    <Text fontSize="$sm" fontWeight="$semibold" color="$primary500">
                      {progressData.percent}%
                    </Text>
                  </HStack>
                  {/* Progress bar */}
                  <Box
                    height={6}
                    bg="$backgroundLight200"
                    borderRadius="$full"
                    overflow="hidden"
                  >
                    <Box
                      height="100%"
                      width={`${Math.min(progressData.percent, 100)}%`}
                      bg="$primary500"
                      borderRadius="$full"
                    />
                  </Box>
                  <Text fontSize="$xs" color="$textMuted" marginTop="$1">
                    Previous: {previousPercent}%
                  </Text>
                </Card>

                {/* Save Progress button - only show when there are unsaved changes */}
                {progressData.percent !== previousPercent && (
                  <Pressable marginTop="$4" onPress={() => handleSaveProgress(progressData.percent)}>
                    <HStack
                      bg="$primary500"
                      paddingHorizontal="$4"
                      paddingVertical="$3"
                      borderRadius="$lg"
                      alignItems="center"
                      space="sm"
                      alignSelf="flex-start"
                    >
                      <LucideIcon
                        name="CheckCircle"
                        size={18}
                        color="white"
                      />
                      <Text
                        fontSize="$sm"
                        fontWeight="$semibold"
                        color="$white"
                      >
                        Save Progress ({Math.round(Math.abs(progressData.percent - previousPercent) / 3)} {Math.abs(progressData.percent - previousPercent) / 3 === 1 ? 'task' : 'tasks'} updated)
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
              <Box paddingHorizontal="$5" paddingVertical="$4">
                <Pressable onPress={() => setIsModalOpen(true)}>
                  {(state: any) => {
                    const isHovered = state?.hovered || state?.pressed || false;
                    return (
                      <Box
                        borderWidth={1}
                        borderStyle="dashed"
                        borderColor={isHovered ? '$primary500' : '$mutedBorder'}
                        borderRadius="$md"
                        padding="$3"
                        alignItems="center"
                        justifyContent="center"
                        bg={isHovered ? '$primary100' : '$accent100'}
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
                            Add Custom Task
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
