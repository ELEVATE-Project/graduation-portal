import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Box, Container, VStack, HStack, Text, Pressable, Button, ButtonText, Spinner, ButtonIcon } from '@ui';
import { LucideIcon } from '@ui';
import { AssessmentCard } from '@components/ObservationCards';
import { getParticipantProfile } from '../../../services/participantService';
import { getTargetedSolutions } from '../../../services/solutionService';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { logVisitStyles } from './Style';
import NotFound from '@components/NotFound';
import { ParticipantData } from '@app-types/participant';
import { AssessmentSurveyCardData } from '@app-types/participant';
import logger from '@utils/logger';
import { isWeb } from '@utils/platform';
import { User } from '@contexts/AuthContext';
import { FILTER_KEYWORDS } from '@constants/LOG_VISIT_CARDS';

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
  const [participant, setParticipant] = useState<ParticipantData | User | undefined>(undefined);
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
          "filter[keywords]":FILTER_KEYWORDS.LOG_VISIT.join(',')
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

  // Error State: Missing participant ID or participant not found
  if (!participant) {
    return <NotFound message="participantDetail.notFound.title" />;
  }

  if(loading) {
    return <Spinner height={isWeb ? '$calc(100vh - 68px)' : '$full'} size="large" color="$primary500" />;
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
                  {t('actions.logVisit')}
                </Text>
                <Text {...TYPOGRAPHY.bodySmall} color="$textMutedForeground">
                  {t('logVisit.selectVisitType', { name: participant?.name || '' })}
                </Text>
              </VStack>
            </HStack>
            
             {/* @ts-ignore: Back Button */}
              <Button variant="outlineghost" onPress={() => {
                // @ts-ignore
                navigation.navigate('check-ins-list', { id: route.params?.id });
              }}>
              <ButtonIcon as={LucideIcon} name="Clock" size={16} />
              <ButtonText {...TYPOGRAPHY.bodySmall}>{t('logVisit.viewCheckIns')}</ButtonText>
            </Button>
          </HStack>
        </Container>
      </VStack>
      <Container>
        {/* Cards */}
        <VStack {...logVisitStyles.cardsContainer}>
          {!loading && solutions.length > 0 ? (
            solutions.map(card => (
              <AssessmentCard key={card.id} card={card} userId={participant?.id || ''} />
            ))
          ) : (
            !loading && (
              <Text color="$textMutedForeground" textAlign="center" py="$4">
                {t('logVisit.noSolutions')}
              </Text>
            )
          )}
        </VStack>
        <VStack {...logVisitStyles.noteContainer}>
           <HStack {...logVisitStyles.noteBox}>
            <Text {...TYPOGRAPHY.bodySmall} color="$textForeground" fontWeight="$medium">{t('logVisit.note')}  
              <Text {...TYPOGRAPHY.bodySmall} color="$textMutedForeground" pl="$1">
              {t('logVisit.logVisitNote')}
              </Text> 
            </Text>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default LogVisit;

