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
  const participantName = participant?.name || '';

  /**
   * Handle Back Navigation
   * Navigates back to participant detail
   */
  const handleBackPress = () => {
    // @ts-ignore
    navigation.goBack();
  };

  return (
    <Box flex={1} bg="$accent100">
       {/* Header */}
       <VStack {...logVisitStyles.headerContainer}>
          <Container>
            <HStack {...logVisitStyles.headerContent}>
              <HStack alignItems="center" gap="$3" flex={1}>
                <Pressable onPress={handleBackPress}>
                  <LucideIcon
                    name="ArrowLeft"
                    size={20}
                    color={theme.tokens.colors.textForeground}
                  />
                </Pressable>
                <VStack flex={1}>
                  <Text {...TYPOGRAPHY.h3} color="$textForeground">
                    {t('actions.logVisit')}
                  </Text>
                  <Text {...TYPOGRAPHY.bodySmall} color="$textMutedForeground">
                    {t('logVisit.selectVisitType', { name: participantName })}
                  </Text>
                </VStack>
              </HStack>
              
              <Button
                variant="outline"
                padding="$3"
                bg="$backgroundLight100"
                borderColor="$borderLight300"
                borderRadius="$xl"
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
                  <ButtonText 
                    color="$textForeground" 
                    fontSize="$sm" 
                    fontWeight="$medium"
                    display="none"
                    $md-display="flex"
                  >
                    {t('logVisit.viewCheckIns')}
                  </ButtonText>
                </HStack>
              </Button>
            </HStack>
            </Container>
          </VStack>
      
      <Container>
       

        {/* Cards */}
        <VStack space="md" padding="$4" $md-padding="$6"  marginHorizontal="$0"
          $md-marginHorizontal="$24" gap="$4" alignItems="stretch" $md-alignItems="flex-start">
          {LOG_VISIT_CARDS.map(card => (
            <AssessmentCard key={card.id} card={card} />
          ))}
        </VStack>
        <VStack paddingHorizontal="$4" $md-paddingHorizontal="$6"  marginHorizontal="$0" 
          $md-marginHorizontal="$24">
           <HStack bg="$accent200" borderRadius="$lg" padding="$4" borderWidth="$1" borderColor="$borderLight300" gap="$2">
            <Text {...TYPOGRAPHY.bodySmall} color="$textForeground" fontWeight="$medium">Note:</Text>
            <Text {...TYPOGRAPHY.bodySmall} color="$textMutedForeground">
              {t('logVisit.logVisitNote')}
            </Text>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default LogVisit;

