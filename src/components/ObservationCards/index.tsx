import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Card, Box, VStack, HStack, Text, Button, ButtonText, Pressable } from '@ui';
import { AssessmentSurveyCardProps } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
import { assessmentSurveyCardStyles } from './Styles';
import { theme } from '@config/theme';
import { CARD_STATUS } from '@constants/app.constant';
import logger from '@utils/logger';

/**
 * AssessmentCard Component
 * Reusable card component for displaying assessment survey information
 */
export const AssessmentCard: React.FC<AssessmentSurveyCardProps> = ({
  card,
  userId
}) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const { name, description, additionalInfo, icon, status, actionButton, navigationUrl } = card;

  // Get status badge styling based on status type
  const getStatusBadgeStyle = () => {
    if (!status) return null;
    switch (status) {
      case CARD_STATUS.ACTIVE:
        return assessmentSurveyCardStyles.statusBadgeActive;
      case CARD_STATUS.INACTIVE:
        return assessmentSurveyCardStyles.statusBadgeInactive;
      case CARD_STATUS.GRADUATED:
        return assessmentSurveyCardStyles.statusBadgeGraduated;
      case CARD_STATUS.COMPLETED:
        return assessmentSurveyCardStyles.statusBadgeCompleted;
      case CARD_STATUS.IN_PROGRESS:
        return assessmentSurveyCardStyles.statusBadgeInProgress;
      case CARD_STATUS.NOT_STARTED:
      default:
        return assessmentSurveyCardStyles.statusBadgeNotStarted;
    }
  };

  // Format status label (replace placeholder with percentage if needed)
  const formatStatusLabel = () => {
    if (!status) return '';
    return t(status);
  };

  // Get button styling based on variant
  const getButtonStyle = () => {
    if (!actionButton) return assessmentSurveyCardStyles.buttonSecondary;
    return actionButton.variant === 'primary'
      ? assessmentSurveyCardStyles.buttonPrimary
      : assessmentSurveyCardStyles.buttonSecondary;
  };

  // Get icon background color based on card type
  const getIconBackgroundColor = () => {
    return card.iconColor || theme.tokens.colors.primary500;
  };

  return (
    <Card
      {...assessmentSurveyCardStyles.cardContainer}
      $web-boxShadow="none" // Remove shadow on web
    >
      {/* Card Header with Icon, name, Description, Action Button and Status Badge */}
      <HStack
        {...assessmentSurveyCardStyles.cardHeader}
      >
        <HStack alignItems="flex-start" gap="$4" flex={1}>
          <Box 
            {...assessmentSurveyCardStyles.iconContainer}
            bg={getIconBackgroundColor()}
          >
            <LucideIcon name={icon} size={24} />
          </Box>
          <VStack flex={1} space="md">
            <Text {...assessmentSurveyCardStyles.name}>{t(name)}</Text>

            {/* Card Description */}
            <VStack space="sm">
              <Text {...assessmentSurveyCardStyles.additionalInfo}>
                {t(description)}
              </Text>
              {additionalInfo && (
                <Text {...assessmentSurveyCardStyles.additionalInfo}>
                  {t(additionalInfo)}
                </Text>
              )}
            </VStack>

            {/* Action Button */}
            {actionButton && (
              <Button
                {...getButtonStyle()}
                onPress={() => {
                  if(navigationUrl && userId) {
                    // @ts-ignore
                    navigation.navigate(navigationUrl as never, { id: userId || '',solutionId:card?.id });
                  } else {
                    logger.log('userId is required');
                  }
                  if (actionButton.onPress) {
                    actionButton.onPress();
                  } else {
                    // Default action - can be customized
                    logger.log(`Action: ${actionButton.label}`);
                  }
                }}
              >
                <HStack alignItems="center" gap="$2">
                  <LucideIcon
                    name={actionButton.icon}
                    size={16}
                    color={
                      actionButton.variant === 'primary'
                        ? theme.tokens.colors.white
                        : theme.tokens.colors.textForeground
                    }
                  />
                  <ButtonText
                    {...assessmentSurveyCardStyles.buttonText}
                    color={
                      actionButton.variant === 'primary'
                        ? '$white'
                        : '$textForeground'
                    }
                  >
                    {t(actionButton.label)}
                  </ButtonText>
                </HStack>
              </Button>
            )}
          </VStack>
        </HStack>

        {/* Status Badge - only show if status exists */}
        {status && !navigationUrl && (
          <Box {...getStatusBadgeStyle()}>
            <HStack alignItems="center" gap="$1">
              {(status === CARD_STATUS.GRADUATED || status === CARD_STATUS.COMPLETED) && (
                <LucideIcon
                  name="CheckCircle"
                  size={12}
                  color={
                    status === CARD_STATUS.GRADUATED
                      ? theme.tokens.colors.white
                      : theme.tokens.colors.success600
                  }
                />
              )}
              <Text
                {...(status === CARD_STATUS.GRADUATED
                  ? assessmentSurveyCardStyles.statusBadgeTextGraduated
                  : status === CARD_STATUS.COMPLETED
                  ? assessmentSurveyCardStyles.statusBadgeTextCompleted
                  : assessmentSurveyCardStyles.statusBadgeText)}
              >
                {formatStatusLabel()}
              </Text>
            </HStack>
          </Box>
        )}

        {/* Navigation Arrow - show if navigationUrl exists */}
        {navigationUrl && (
          <Pressable
            onPress={() => {
              // @ts-ignore
              navigation.navigate(navigationUrl as never, { id: userId || '',solutionId:card?.solutionId || card?.id });
            }}
            $web-cursor="pointer"
          >
            <LucideIcon
              name="ArrowRight"
              size={20}
              color={theme.tokens.colors.textMutedForeground}
            />
          </Pressable>
        )}
      </HStack>
    </Card>
  );
};

