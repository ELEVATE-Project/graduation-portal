import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Card, Box, VStack, HStack, Text, Button, ButtonText, Pressable } from '@ui';
import { AssessmentSurveyCardProps } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
import { assessmentSurveyCardStyles } from './Styles';
import { theme } from '@config/theme';
import { CARD_STATUS } from '@constants/app.constant';

/**
 * AssessmentCard Component
 * Reusable card component for displaying assessment survey information
 */
export const AssessmentCard: React.FC<AssessmentSurveyCardProps> = ({
  card,
}) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const { title, description, additionalInfo, icon, status, actionButton, navigationUrl } = card;

  // Get status badge styling based on status type
  const getStatusBadgeStyle = () => {
    if (!status) return null;
    switch (status.type) {
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
    if (status.percentage !== undefined) {
      return t(status.label, { percentage: status.percentage });
    }
    return t(status.label);
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
      {/* Card Header with Icon, Title, Description, Action Button and Status Badge */}
      <HStack
        {...assessmentSurveyCardStyles.cardHeader}
      >
        <HStack alignItems="flex-start" gap="$4" flex={1}>
          <Box 
            {...assessmentSurveyCardStyles.iconContainer}
            bg={getIconBackgroundColor()}
          >
            <LucideIcon
              name={icon}
              size={24}
            />
          </Box>
          <VStack flex={1} space="md">
            <Text {...assessmentSurveyCardStyles.title}>{t(title)}</Text>

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
            if (actionButton.onPress) {
              actionButton.onPress();
            } else {
              // Default action - can be customized
              console.log(`Action: ${actionButton.label}`);
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
        {status && (
          <Box {...getStatusBadgeStyle()}>
            <HStack alignItems="center" gap="$1">
              {(status.type === CARD_STATUS.GRADUATED || status.type === CARD_STATUS.COMPLETED) && (
                <LucideIcon
                  name="CheckCircle"
                  size={12}
                  color={
                    status.type === CARD_STATUS.GRADUATED
                      ? theme.tokens.colors.white
                      : theme.tokens.colors.success600
                  }
                />
              )}
              <Text
                {...(status.type === CARD_STATUS.GRADUATED
                  ? assessmentSurveyCardStyles.statusBadgeTextGraduated
                  : status.type === CARD_STATUS.COMPLETED
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
              navigation.navigate(navigationUrl);
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

