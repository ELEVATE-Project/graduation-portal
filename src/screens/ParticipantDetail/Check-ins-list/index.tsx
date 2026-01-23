import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Pressable,
  Spinner,
  Card,
  Button,
  ButtonText,
} from '@ui';
import { LucideIcon, Select } from '@ui';
import { getParticipantProfile } from '../../../services/participantService';
import {
  getTargetedSolutions,
  getObservationEntities,
  getObservationSubmissions,
} from '../../../services/solutionService';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { logVisitStyles } from './Style';
import { assessmentSurveyCardStyles } from '@components/ObservationCards/Styles';
import NotFound from '@components/NotFound';
import { ParticipantData } from '@app-types/participant';
import { AssessmentSurveyCardData } from '@app-types/participant';
import logger from '@utils/logger';
import { isWeb } from '@utils/platform';
import { useAuth, User } from '@contexts/AuthContext';
import { ENTITY_TYPE } from '@constants/ROLES';
import { StatusBadge } from '@components/ObservationCards';
import { CARD_STATUS } from '@constants/app.constant';

/**
 * Route parameters type definition for LogVisit screen
 */
type LogVisitRouteParams = {
  id?: string;
};

/**
 * Route type for LogVisit screen
 */
type LogVisitRouteProp = RouteProp<{
  params: LogVisitRouteParams;
}>;

/**
 * LogVisit Component
 * Component for logging and viewing participant visits/check-ins
 */
const LogVisit: React.FC = () => {
  const route = useRoute<LogVisitRouteProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const [solutions, setSolutions] = useState<AssessmentSurveyCardData[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<string>('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState<boolean>(false);
  const [participant, setParticipant] = useState<
    ParticipantData | User | undefined
  >(undefined);
  const { user } = useAuth()
  const navigation = useNavigation();
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
        if (route.params?.id) {
          const participantData = await getParticipantProfile(route.params?.id);
          setParticipant(participantData);
        }
      } catch (error) {
        logger.error('Error fetching solutions:', error);
        setSolutions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [route.params?.id]);

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
          (submissionsData?.result || submissionsData?.data || []).filter((e:any) => e.status === CARD_STATUS.COMPLETED);
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

  /**
   * Handle Back Navigation
   * Goes back to the previous screen in the navigation stack
   * Falls back to navigating to participant-detail if goBack is not available
   */
  const handleBackPress = () => {
    if (navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: Navigate to participant detail if there's no previous screen
      // @ts-ignore
      navigation.navigate('participant-detail', { id: route.params?.id });
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
      {/* Header */}
      <VStack {...logVisitStyles.headerContainer}>
        <Container>
          <HStack {...logVisitStyles.headerContent}>
            <HStack alignItems="center" gap="$3" flex={1}>
              <Pressable onPress={handleBackPress}>
                <Box>
                  <LucideIcon
                    name="ArrowLeft"
                    size={20}
                    color={theme.tokens.colors.textForeground}
                  />
                </Box>
              </Pressable>
              <VStack flex={1}>
                <Text {...TYPOGRAPHY.h3} color="$textForeground" mb="$1">
                  {t('participantDetail.header.checkInsHistory')}
                </Text>
                <Text {...TYPOGRAPHY.bodySmall} color="$textMutedForeground">
                  {t('participantDetail.header.checkInsHistoryDescription', {
                    name: participant?.name || '',
                  })}
                </Text>
              </VStack>
            </HStack>
            {/* Solution Select Dropdown */}
            <Select
              options={solutions.map(solution => ({
                label: solution.name || solution.id,
                value: solution.solutionId || solution.id,
              }))}
              value={selectedSolution}
              onChange={setSelectedSolution}
              placeholder={
                t('logVisit.selectSolutionPlaceholder') ||
                'Select a solution...'
              }
            />
          </HStack>
        </Container>
      </VStack>
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
                          {...assessmentSurveyCardStyles.iconContainer}
                          bg="$primary500"
                        >
                          <LucideIcon
                            name="FileText"
                            size={24}
                            color="$white"
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
                              {t('logVisit.by')} {user?.name}
                            </Text>
                          </HStack>
                          <Button
                            {...assessmentSurveyCardStyles.buttonSecondary}
                            onPress={() => {
                              // @ts-ignore
                              navigation.navigate('observation' as never, {
                                id: participant?.id || '',
                                solutionId: selectedSolution,
                                submissionNumber: submission.submissionNumber,
                              });
                            }}
                          >
                            <HStack alignItems="center" gap="$2">
                              <LucideIcon name={'Eye'} size={16} />
                              <ButtonText
                                {...assessmentSurveyCardStyles.buttonText}
                                color="$textForeground"
                              >
                                {t('logVisit.viewForm')}
                              </ButtonText>
                            </HStack>
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

export default LogVisit;
