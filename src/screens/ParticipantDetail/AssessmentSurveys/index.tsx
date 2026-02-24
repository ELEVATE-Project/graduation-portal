import React, { useMemo } from 'react';
import { VStack, Box, ScrollView, Text } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { assessmentSurveysStyles } from './Styles';
import { AssessmentCard } from '@components/ObservationCards';
import { ASSESSMENT_SURVEY_CARDS } from '@constants/ASSESSMENT_SURVEY_CARDS';
import type { ParticipantData, ParticipantStatus } from '@app-types/participant';

interface AssessmentSurveysProps {
  participant: ParticipantData;
}

/**
 * AssessmentSurveys Component
 * Displays assessment survey cards based on participant status
 */
const AssessmentSurveys: React.FC<AssessmentSurveysProps> = ({
  participant
}) => {
  const { t } = useLanguage();

  // Filter cards based on visibility rules and participant status
  const visibleCards = useMemo(() => {
    return ASSESSMENT_SURVEY_CARDS.filter(card => {
      const { visibilityRules } = card;

      // If no visibility rules, show the card
      if (!visibilityRules) {
        return true;
      }

      // Check hideForStatuses first
      if (
        visibilityRules.hideForStatuses &&
        visibilityRules.hideForStatuses.includes(participant?.status as ParticipantStatus)
      ) {
        return false;
      }

      // Check showForStatuses
      if (visibilityRules.showForStatuses) {
        return visibilityRules.showForStatuses.includes(participant?.status as ParticipantStatus);
      }

      // If only hideForStatuses is defined and status is not in it, show the card
      return true;
    });
  }, [participant]);

  if (visibleCards.length === 0) {
    return (
      <Box {...assessmentSurveysStyles.container}>
        <VStack {...assessmentSurveysStyles.content}>
          <VStack {...assessmentSurveysStyles.emptyState}>
            <Box {...assessmentSurveysStyles.emptyIconContainer}>
              {/* You can add an icon here if needed */}
            </Box>
            <VStack {...assessmentSurveysStyles.emptyTextContainer}>
              <Text {...assessmentSurveysStyles.emptyTitle}>
                {t('participantDetail.assessmentSurveys.noSurveysTitle')}
              </Text>
              <Text {...assessmentSurveysStyles.emptyDescription}>
                {t('participantDetail.assessmentSurveys.noSurveysDescription')}
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <ScrollView
      {...assessmentSurveysStyles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <VStack {...assessmentSurveysStyles.cardsContainer} gap="$5">
        {visibleCards.map(card => (
          <AssessmentCard key={card.id} card={card} userId={participant.userId} />
        ))}
      </VStack>
    </ScrollView>
  );
};

export default AssessmentSurveys;
