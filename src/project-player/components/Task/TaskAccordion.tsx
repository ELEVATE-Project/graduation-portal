import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  Card,
} from '@gluestack-ui/themed';
import { LucideIcon } from '@ui/index';
import { useLanguage } from '@contexts/LanguageContext';
import { useProjectContext } from '../../context/ProjectContext';
import TaskComponent from '../ProjectComponent/TaskComponent';
import AddCustomTask from './AddCustomTask';
import { TaskAccordionProps } from '../../types/components.types';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { taskAccordionStyles } from './Styles';
import { usePlatform } from '@utils/platform';

const TaskAccordion: React.FC<TaskAccordionProps> = ({ task, level = 0 }) => {
  const { t } = useLanguage();
  const { mode } = useProjectContext();
  const { isWeb } = usePlatform();

  const isPreview = mode === 'preview';
  const isSocialProtection =
    task.metadata?.category === 'protection' ||
    task.name === 'Social Protection';

  // Helper function to get pillar icon and color
  const getPillarIcon = (pillarName: string): { icon: string; color: string } => {
    const lowerName = pillarName.toLowerCase();
    if (lowerName.includes('social empowerment') || lowerName.includes('empowerment')) {
      return { icon: 'Users', color: theme.tokens.colors.pillarSocialEmpowerment };
    }
    if (lowerName.includes('livelihood')) {
      return { icon: 'Briefcase', color: theme.tokens.colors.pillarLivelihoods };
    }
    if (lowerName.includes('financial inclusion') || lowerName.includes('financial')) {
      return { icon: 'DollarSign', color: theme.tokens.colors.pillarFinancialInclusion };
    }
    if (lowerName.includes('social protection') || lowerName.includes('protection')) {
      return { icon: 'Shield', color: theme.tokens.colors.pillarSocialProtection };
    }
    return { icon: 'Folder', color: theme.tokens.colors.textSecondary }; // Default
  };

  const pillarIconData = getPillarIcon(task.name);

  // For Edit/Read-Only modes: Show as Card (always expanded)
  if (!isPreview) {
    // Calculate pillar progress percentage
    const completedTasks = task.children?.filter(child =>
      child.status === 'completed'
    ).length || 0;
    const totalTasks = task.children?.length || 0;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
      <Box {...taskAccordionStyles.container}>
        <Card {...taskAccordionStyles.card}>
          {/* Card Header with Progress on right */}
          <Box {...taskAccordionStyles.cardHeader}>
            <HStack {...taskAccordionStyles.cardHeaderContent} justifyContent="space-between">
              <HStack {...taskAccordionStyles.pillarHeaderRow}>
                <LucideIcon
                  name={pillarIconData.icon}
                  size={20}
                  color={pillarIconData.color}
                />
                <Text {...TYPOGRAPHY.h4} color="$textPrimary">
                  {task.name}
                </Text>
              </HStack>
              {/* Pillar progress percentage on right */}
              <Text {...taskAccordionStyles.progressText}>
                {progressPercent}%
              </Text>
            </HStack>
          </Box>

          {/* Card Content - Always visible (no accordion) */}
          <Box {...taskAccordionStyles.cardContent} paddingHorizontal={isWeb ? "$5" : "$2"}>


            <VStack {...taskAccordionStyles.cardContentStack}>
              {task.children?.map((childTask, index) => (
                <TaskComponent
                  key={childTask._id}
                  task={childTask}
                  level={1}
                  isLastTask={index === (task.children?.length || 0) - 1}
                  isChildOfProject={true}
                />
              ))}


            </VStack>
          </Box>
        </Card>
      </Box>
    );
  }

  // For Preview mode: Show as Accordion
  return (
    <Box {...taskAccordionStyles.container}>
      <Accordion {...taskAccordionStyles.accordion}>
        <AccordionItem
          value={task._id}
          {...taskAccordionStyles.accordionItem}
          bg={
            isSocialProtection
              ? '$socialProtectionBg'
              : taskAccordionStyles.accordionItem.bg
          }
          borderColor={
            isSocialProtection
              ? '$primary500'
              : taskAccordionStyles.accordionItem.borderColor
          }
        >
          {/* Accordion Header */}
          <AccordionHeader>
            <AccordionTrigger
              {...taskAccordionStyles.accordionTrigger}
              padding={isWeb ? "$5" : "$1"}
            >
              {({ isExpanded }: { isExpanded: boolean }) => (
                <>
                  <HStack {...taskAccordionStyles.accordionHeaderContent}>
                    <VStack flex={1} space="xs">
                      <HStack alignItems="center" space="sm" flexWrap="wrap">
                        <Text
                          {...TYPOGRAPHY.h4}
                          color="$textPrimary"
                          sx={
                            isWeb
                              ? {
                                ':hover': {
                                  textDecorationLine: 'underline',
                                  cursor: 'pointer',
                                },
                              }
                              : undefined
                          }
                        >
                          {task.name}
                        </Text>
                        <Box {...taskAccordionStyles.taskBadge}>
                          <Text {...taskAccordionStyles.taskBadgeText}>
                            {task.children?.length || 0}{' '}
                            {t('projectPlayer.tasks')}
                          </Text>
                        </Box>
                        {isSocialProtection && (
                          <HStack {...taskAccordionStyles.actionRequiredBadge}>
                            <LucideIcon name="AlertCircle" size={taskAccordionStyles.warningIconSize} color={theme.tokens.colors.warningIconColor} />
                            <Text {...taskAccordionStyles.actionRequiredText}>
                              {t('participantDetail.interventionPlan.actionRequired')}
                            </Text>
                          </HStack>
                        )}
                      </HStack>
                      {task.description && (
                        <Text
                          {...TYPOGRAPHY.paragraph}
                          color="$textSecondary"
                          lineHeight="$lg"
                        >
                          {task.description}
                        </Text>
                      )}
                    </VStack>

                    {/* Custom Lucide Icon */}
                    <Box {...taskAccordionStyles.accordionIconContainer}>
                      <LucideIcon
                        name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                        size={20}
                        color={theme.tokens.colors.textSecondary}
                      />
                    </Box>
                  </HStack>
                </>
              )}
            </AccordionTrigger>
          </AccordionHeader>

          {/* Accordion Content - Collapsible in preview mode */}
          <AccordionContent {...taskAccordionStyles.accordionContent} paddingHorizontal={isWeb ? "$5" : "$1"}>
            {/* Info Banner - Only for Social Protection in Preview Mode */}
            {task.metadata?.warningMessage && (
              <Box {...taskAccordionStyles.infoBanner}>
                <HStack {...taskAccordionStyles.infoBannerContent}>
                  <LucideIcon name="Info" size={taskAccordionStyles.infoIconSize} color={theme.tokens.colors.infoIconColor} />
                  <VStack flex={1}>
                    <Text {...taskAccordionStyles.infoBannerTitle}>
                      Important:
                    </Text>
                    <Text {...taskAccordionStyles.infoBannerMessage}>
                      {task.metadata.warningMessage}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}

            <VStack {...taskAccordionStyles.accordionContentStack}>
              {task.children?.map((childTask, index) => (
                <TaskComponent
                  key={childTask._id}
                  task={childTask}
                  level={level + 1}
                  isLastTask={index === task.children!.length - 1}
                  isChildOfProject={true}
                />
              ))}

              {/* Add Custom Task Button */}
              <AddCustomTask templateId={task._id} templateName={task.name} />
            </VStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default TaskAccordion;
