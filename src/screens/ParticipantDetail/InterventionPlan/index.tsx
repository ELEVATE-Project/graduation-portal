import React from 'react';
import { VStack, Text, Button, ButtonText, Box } from '@ui';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
import { interventionPlanStyles } from './Styles';
import { InterventionPlanProps } from '@app-types/screens';

/**
 * InterventionPlan Component
 * Displays intervention plan content or empty state
 */


const InterventionPlan: React.FC<InterventionPlanProps> = ({ participantId, participantName }) => {
  const { t } = useLanguage();
  const navigation = useNavigation();

  return (
    <Box {...interventionPlanStyles.container}>
      <VStack {...interventionPlanStyles.content as any}>
        {/* Icon */}
        <Box {...interventionPlanStyles.iconContainer}>
          <LucideIcon
            name="FileText"
            size={48}
            color={interventionPlanStyles.iconColor}
          />
        </Box>

        {/* Title */}
        <Text {...interventionPlanStyles.title}>
          {t('participantDetail.interventionPlan.noPlanAssigned')}
        </Text>

        {/* Description */}
        <Text {...interventionPlanStyles.description}>
          {t('participantDetail.interventionPlan.noPlanDescription')}
        </Text>

        {/* Action Button */}
        <Button
          {...interventionPlanStyles.button}
          onPress={() => {
            // Navigate to IDP screen and pass participantId
            // @ts-ignore - navigation typing
            navigation.navigate('idp', { participantId });
          }}
        >
          <ButtonText {...interventionPlanStyles.buttonText}>
            {t('participantDetail.interventionPlan.developPlan')}
          </ButtonText>
        </Button>
      </VStack>
    </Box>
  );
};

export default InterventionPlan;

