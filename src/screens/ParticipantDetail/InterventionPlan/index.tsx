import React from 'react';
import { VStack, Text, Button, ButtonText, Box } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
import { interventionPlanStyles } from './Styles';

/**
 * InterventionPlan Component
 * Displays intervention plan content or empty state
 */
const InterventionPlan: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box {...interventionPlanStyles.container}>
      <VStack {...interventionPlanStyles.content}>
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
            // TODO: Implement develop intervention plan action
            console.log('Develop Intervention Plan clicked');
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
