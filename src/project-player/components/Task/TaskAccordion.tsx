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
  Button,
  ButtonText,
  Pressable,
} from '@gluestack-ui/themed';
import { LucideIcon } from '@ui/index';
import { useLanguage } from '@contexts/LanguageContext';
import { useProjectContext } from '../../context/ProjectContext';
import TaskComponent from '../ProjectComponent/TaskComponent';
// import AddCustomTask from './AddCustomTask';
import { TaskAccordionProps } from '../../types/components.types';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { taskAccordionStyles } from './Styles';

const TaskAccordion: React.FC<TaskAccordionProps> = ({ task, level = 0 }) => {
  const { t } = useLanguage();
  const { mode } = useProjectContext();

  const isPreview = mode === 'preview';
  const isSocialProtection =
    task.metadata?.category === 'protection' ||
    task.name === 'Social Protection';

  // For Edit/Read-Only modes: Show as Card (always expanded)
  if (!isPreview) {
    return (
      <Box {...taskAccordionStyles.container}>
        <Card {...taskAccordionStyles.card}>
          {/* Card Header */}
          <Box {...taskAccordionStyles.cardHeader}>
            <HStack {...taskAccordionStyles.cardHeaderContent}>
              <VStack flex={1} space="xs">
                <HStack alignItems="center" space="sm" flexWrap="wrap">
                  <Text {...TYPOGRAPHY.h4} color="$textPrimary">
                    {task.name}
                  </Text>
                  <Box {...taskAccordionStyles.taskBadge}>
                    <Text
                      fontSize="$xs"
                      fontWeight="$medium"
                      color="$primary500"
                    >
                      {task.children?.length || 0} {t('projectPlayer.tasks')}
                    </Text>
                  </Box>
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
            </HStack>
          </Box>

          {/* Card Content - Always visible (no accordion) */}
          <Box {...taskAccordionStyles.cardContent}>
            {/* Info Banner - Only for Social Protection */}
            {task.metadata?.warningMessage && (
              <Box
                bg="$info50"
                borderLeftWidth={4}
                borderLeftColor="$info600"
                borderRadius="$md"
                padding="$3"
                marginBottom="$4"
              >
                <HStack space="sm" alignItems="flex-start">
                  <LucideIcon name="Info" size={16} color={theme.tokens.colors.info600} />
                  <VStack flex={1}>
                    <Text
                      fontSize="$xs"
                      fontWeight="$semibold"
                      color="$info600"
                      marginBottom="$0.5"
                    >
                      Important:
                    </Text>
                    <Text
                      fontSize="$xs"
                      color="$info700"
                      lineHeight="$sm"
                    >
                      {task.metadata.warningMessage}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}

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


              {/* Add Task Button as Card */}
              <Card
                size="md"
                variant="elevated"
                bg="$backgroundLight50"
                borderRadius="$md"
                marginTop="$2"
                borderWidth={1}
                borderColor="$borderLight300"
                sx={{
                  ':hover': {
                    borderColor: '$primary500',
                    bg: '$primary100',
                  },
                }}
              >
                <Pressable
                  onPress={() => {
                    console.log('Add task to pillar:', task.name);
                  }}
                  padding="$0.5"
                >
                  <HStack justifyContent="center" alignItems="center">
                    <Text
                      color="$textPrimary"
                      fontSize="$sm"
                      fontWeight="$medium"
                      sx={{
                        ':hover': {
                          color: '$primary500',
                        },
                      }}
                    >
                      + {t('projectPlayer.addTaskToPillar')}
                    </Text>
                  </HStack>
                </Pressable>
              </Card>

              {/* Add Custom Task Button - Only in Preview Mode */}
              {/* {isPreview && (
                <AddCustomTask pillarId={task._id} _pillarName={task.name} />
              )} */}
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
              ? '#FFF5F5'
              : taskAccordionStyles.accordionItem.bg
          }
          borderColor={
            isSocialProtection
              ? '$primary200'
              : taskAccordionStyles.accordionItem.borderColor
          }
        >
          {/* Accordion Header */}
          <AccordionHeader>
            <AccordionTrigger {...taskAccordionStyles.accordionTrigger}>
              {({ isExpanded }: { isExpanded: boolean }) => (
                <>
                  <HStack {...taskAccordionStyles.accordionHeaderContent}>
                    <VStack flex={1} space="xs">
                      <HStack alignItems="center" space="sm" flexWrap="wrap">
                        <Text {...TYPOGRAPHY.h4} color="$textPrimary">
                          {task.name}
                        </Text>
                        <Box {...taskAccordionStyles.taskBadge}>
                          <Text
                            fontSize="$xs"
                            fontWeight="$medium"
                            color="$primary500"
                          >
                            {task.children?.length || 0}{' '}
                            {t('projectPlayer.tasks')}
                          </Text>
                        </Box>
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
          <AccordionContent {...taskAccordionStyles.accordionContent}>
            {/* Info Banner - Only for Social Protection in Preview Mode */}
            {task.metadata?.warningMessage && (
              <Box
                bg="$info50"
                borderLeftWidth={4}
                borderLeftColor="$info600"
                borderRadius="$md"
                padding="$3"
                marginBottom="$4"
              >
                <HStack space="sm" alignItems="flex-start">
                  <LucideIcon name="Info" size={16} color="#0284c7" />
                  <VStack flex={1}>
                    <Text
                      fontSize="$xs"
                      fontWeight="$semibold"
                      color="$info600"
                      marginBottom="$0.5"
                    >
                      Important:
                    </Text>
                    <Text
                      fontSize="$xs"
                      color="$info700"
                      lineHeight="$sm"
                    >
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


              {/* Add Task Button as Card */}
              <Card
                size="md"
                variant="elevated"
                bg="$backgroundLight50"
                borderRadius="$md"
                marginTop="$2"
                borderWidth={1}
                borderColor="$borderLight300"
                sx={{
                  ':hover': {
                    borderColor: '$primary500',
                    bg: '$primary100',
                  },
                }}
              >
                <Pressable
                  onPress={() => {
                    console.log('Add task to pillar:', task.name);
                  }}
                  padding="$0.5"
                >
                  <HStack justifyContent="center" alignItems="center">
                    <Text
                      color="$textPrimary"
                      fontSize="$sm"
                      fontWeight="$medium"
                      sx={{
                        ':hover': {
                          color: '$primary500',
                        },
                      }}
                    >
                      + {t('projectPlayer.addTaskToPillar')}
                    </Text>
                  </HStack>
                </Pressable>
              </Card>

              {/* Add Custom Task Button */}
              {/* <AddCustomTask pillarId={task._id} _pillarName={task.name} /> */}
            </VStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default TaskAccordion;
