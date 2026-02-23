import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Spinner,
  Card,
  Button,
  ButtonText,
  ButtonIcon,
} from '@ui';
import { LucideIcon, Select } from '@ui';
import { getParticipantProfile } from '../../../services/participantService';
import {
  getTargetedSolutions,
  getObservationEntities,
  getObservationSubmissions,
} from '../../../services/solutionService';
import { useLanguage } from '@contexts/LanguageContext';
import { logVisitStyles } from './Style';
import { assessmentSurveyCardStyles } from '@components/ObservationCards/Styles';
import NotFound from '@components/NotFound';
import { ParticipantData } from '@app-types/participant';
import { AssessmentSurveyCardData } from '@app-types/participant';
import logger from '@utils/logger';
import { isWeb } from '@utils/platform';
import { ENTITY_TYPE } from '@constants/ROLES';
import { StatusBadge } from '@components/ObservationCards';
import { CARD_STATUS } from '@constants/app.constant';
import { ICONS } from '@constants/LOG_VISIT_CARDS';

/**
 * CheckInsListContent Component Props
 * Component without navigation dependencies - can be used in modals
 */
interface CheckInsListContentProps {
  id: string;
  userName?: string;
  onClose?: () => void;
  onFormSelect?: (submission: any) => void;
  onNavigateToObservation?: (params: {
    id: string;
    solutionId: string;
    submissionNumber: number;
  }) => void;
  preSelectedSolution?: string;
}

/**
 * CheckInsListContent Component
 * Component for viewing participant check-ins without navigation dependencies
 */
const CheckInsListContent: React.FC<CheckInsListContentProps> = ({
  id,
  userName,
  onNavigateToObservation,
  preSelectedSolution,
  onFormSelect
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [solutions, setSolutions] = useState<AssessmentSurveyCardData[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<string>('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState<boolean>(false);
  const [iconMeta, setIconMeta] = useState(null);
  const [participant, setParticipant] = useState<
    ParticipantData | undefined
  >(undefined);
  const { t } = useLanguage();

  /**
   * Fetch targeted solutions from API
   */
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const data = await getTargetedSolutions({
          type: 'observation',
        });
        setSolutions(data);
        if (id) {
          const participantData = await getParticipantProfile(id);
          setParticipant(participantData as ParticipantData);
        }
        if (preSelectedSolution) {
          setSelectedSolution(preSelectedSolution);
        }
      } catch (error) {
        logger.error('Error fetching solutions:', error);
        setSolutions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [id, preSelectedSolution]);

  /**
   * Fetch submissions when a solution is selected
   */
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedSolution || !participant?.id) {
        setSubmissions([]);
        return;
      }

      setSubmissionsLoading(true);
      try {
        const solution = solutions.find(
          s => s.solutionId === selectedSolution || s.id === selectedSolution,
        );
        if (!solution) {
          logger.error('Solution not found');
          setSubmissions([]);
          return;
        }
        const iconMetanew = ICONS?.[solution?.name?.toLowerCase() as keyof typeof ICONS];
        setIconMeta(iconMetanew as any);

        // Get observation entities to find observationId and entityId
        const observationData = await getObservationEntities({
          solutionId: solution.solutionId || solution.id,
          profileData: {},
        });

        const observationId = observationData?.result?._id;
        if (!observationId) {
          logger.error('Observation ID not found');
          setSubmissions([]);
          return;
        }

        // Find entityId for the participant
        let entityId: string | null = null;
        if (
          observationData.result?.entityType === ENTITY_TYPE.PARTICIPANT &&
          Array.isArray(observationData.result?.entities)
        ) {
          const participantEntity = observationData.result.entities.find(
            (entityItem: any) => entityItem.externalId === participant.id,
          );
          if (participantEntity) {
            entityId = participantEntity._id;
          }
        }

        if (!entityId) {
          logger.error('Entity ID not found for participant');
          setSubmissions([]);
          return;
        }

        // Fetch submissions
        const submissionsData = await getObservationSubmissions({
          observationId,
          entityId,
        });

        // Map submissions from response
        const submissionsList =
          (submissionsData?.result || submissionsData?.data || []).filter(
            (e: any) => e.status === CARD_STATUS.COMPLETED,
          );
        setSubmissions(Array.isArray(submissionsList) ? submissionsList : []);
      } catch (error) {
        logger.error('Error fetching submissions:', error);
        setSubmissions([]);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchSubmissions();
  }, [selectedSolution, solutions, participant?.id]);

  const handleViewForm = (submissionNumber: number) => {
    if (onNavigateToObservation && participant?.id && selectedSolution) {
      onNavigateToObservation({
        id: participant.id,
        solutionId: selectedSolution,
        submissionNumber,
      });
    }
  };

  if (loading) {
    return (
      <Spinner
        height={isWeb ? ('$calc(100vh - 285px)' as any) : '$full'}
        size="large"
        color="$primary500"
      />
    );
  }

  // Error State: Missing participant ID or participant not found
  if (!participant) {
    return <NotFound message="participantDetail.notFound.title" />;
  }

  return (
    <Box flex={1} bg="$accent100">
      <Container>
        {/* Submissions List */}
        {selectedSolution ? (
          <VStack {...logVisitStyles.cardsContainer}>
            {submissionsLoading ? (
              <Spinner size="large" color="$primary500" />
            ) : submissions.length > 0 ? (
              submissions.map((submission, index) => (
                <Card
                  key={submission._id || index}
                  {...assessmentSurveyCardStyles.cardContainer}
                  $web-boxShadow="none"
                >
                  <VStack space="lg">
                    {/* Card Header with Icon, Title, Description, and Navigation Arrow */}
                    <HStack {...assessmentSurveyCardStyles.cardHeader}>
                      <HStack alignItems="flex-start" space="lg" flex={1}>
                      <Box
                        {...{
                          ...assessmentSurveyCardStyles.iconContainer,
                          bg: iconMeta?.color || '$primary500',
                        }}
                      >
                        <LucideIcon
                          name={iconMeta?.icon || 'info'}
                          size={24}
                          color={iconMeta?.iconColor || '$white'}
                        />
                      </Box>
                        <VStack flex={1} space="md">
                          <HStack alignItems="center" space="sm">
                            <Text {...assessmentSurveyCardStyles.title}>
                              {submission.observationName} #
                              {submission.submissionNumber}
                            </Text>
                            {/* Status Badge - only show if status exists */}
                            {submission.status && (
                              <StatusBadge status={submission.status} />
                            )}
                          </HStack>
                          {/* Card Description */}
                          <HStack>
                            {submission.submissionDate && (
                              <HStack alignItems="center" space="xs">
                                <LucideIcon
                                  name="Calendar"
                                  size={16}
                                  color="$textMutedForeground"
                                />
                                <Text
                                  {...assessmentSurveyCardStyles.description}
                                >
                                  {new Date(
                                    submission.submissionDate,
                                  ).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  })}
                                </Text>
                              </HStack>
                            )}
                            <LucideIcon
                              name="Dot"
                              size={20}
                              color="$textMutedForeground"
                            />
                            <Text {...assessmentSurveyCardStyles.description}>
                              {t('logVisit.by')} {userName || ''}
                            </Text>
                          </HStack>
                          <Button
                            $md-width="fit-content"
                            // @ts-ignore
                            variant={"outlineghost"}
                            onPress={() => handleViewForm(submission.submissionNumber)}
                          >
                            <ButtonIcon as={LucideIcon} name="Eye" size={16} />
                            <ButtonText {...assessmentSurveyCardStyles.buttonText} onPress={() => onFormSelect?.(submission)}>
                              {t('logVisit.viewForm')}
                            </ButtonText>
                          </Button>
                        </VStack>
                      </HStack>
                    </HStack>
                  </VStack>
                </Card>
              ))
            ) : (
              !submissionsLoading && (
                <Card {...assessmentSurveyCardStyles.emptyCard}>
                  <LucideIcon name={'Clock'} size={48} />
                  <Text {...assessmentSurveyCardStyles.emptyCardTitale}>
                    {t('logVisit.noCheckInsYet')}
                  </Text>
                  <Text {...assessmentSurveyCardStyles.emptyCardTitale} pt="$0">
                    {t('logVisit.noCheckInsYetDescription')}
                  </Text>
                </Card>
              )
            )}
          </VStack>
        ) : (
          <Box {...logVisitStyles.selectSolutionContainer}>
            <Card
              {...assessmentSurveyCardStyles.cardContainer}
              {...logVisitStyles.selectSolutionCard}
              $web-boxShadow="none"
            >
              <Text {...logVisitStyles.selectSolutionText}>
                {t('logVisit.selectSolution')}
              </Text>
              <Select
                options={solutions.map(solution => ({
                  label: solution.name || solution.id,
                  value: solution.solutionId || solution.id,
                }))}
                value={selectedSolution}
                onChange={setSelectedSolution}
              />
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CheckInsListContent;

