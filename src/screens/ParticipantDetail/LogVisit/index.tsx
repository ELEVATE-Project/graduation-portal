import React from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Box, Container, VStack, HStack, Text, Pressable, Button, ButtonText } from '@ui';
import { LucideIcon } from '@ui';
import { AssessmentCard } from '@components/ObservationCards';
import { LOG_VISIT_CARDS } from '@constants/LOG_VISIT_CARDS';
import { getParticipantById } from '../../../services/participantService';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { logVisitStyles } from './Style';
import NotFound from '@components/NotFound';

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
  const navigation = useNavigation();
  const { t } = useLanguage();
  const participantId = route.params?.id;
  const participant = participantId ? getParticipantById(participantId) : undefined;

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
      navigation.navigate('participant-detail', { id: participantId });
    }
  };

  // Error State: Missing participant ID or participant not found
  if (!participant) {
    return <NotFound message="participantDetail.notFound.title" />;
  }

  const participantName = participant.name;
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
                    {t('logVisit.selectVisitType', { name: participantName })}
                  </Text>
                </VStack>
              </HStack>
              
              <Button
                {...logVisitStyles.viewCheckInsButton}
                onPress={() => {
                  // Handle view check-ins navigation
                }}
              >
                <HStack alignItems="center" gap="$2">
                  <LucideIcon
                    name="Clock"
                    size={16}
                    color={theme.tokens.colors.textForeground}
                  />
                  <ButtonText {...logVisitStyles.viewCheckInsButtonText}>
                    {t('logVisit.viewCheckIns')}
                  </ButtonText>
                </HStack>
              </Button>
            </HStack>
            </Container>
          </VStack>
      
      <Container>
       

        {/* Cards */}
        <VStack {...logVisitStyles.cardsContainer}>
          {LOG_VISIT_CARDS.map(card => (
            <AssessmentCard key={card.id} card={card} />
          ))}
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

