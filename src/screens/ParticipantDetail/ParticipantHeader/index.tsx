import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, VStack, Text, Box, Pressable, Button, ButtonText, LucideIcon } from '@ui';
import { participantHeaderStyles } from './Styles';
import type { ParticipantStatus, PathwayType } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import ParticipantProgressCard from './ParticipantProgressCard';
import { STATUS } from '@constants/app.constant';
import { theme } from '@config/theme';

/**
 * ParticipantHeader Props
 * Component props for displaying participant header with status-based UI variations.
 */
interface ParticipantHeaderProps {
  participantName: string;
  participantId: string;
  status?: ParticipantStatus;
  pathway?: PathwayType;
  graduationProgress?: number;
  graduationDate?: string;
  onViewProfile?: () => void; // Callback to open profile modal
}

/**
 * ParticipantHeader Component
 * Displays participant header with status-based UI variations and action buttons.
 */
const ParticipantHeader: React.FC<ParticipantHeaderProps> = ({
  participantName,
  participantId,
  status,
  pathway,
  graduationProgress,
  graduationDate,
  onViewProfile,
}) => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  /**
   * Handle Back Navigation
   * Navigates to the participants list page
   */
  const handleBackPress = () => {
    // @ts-ignore
    navigation.navigate('participants');
  };

  /**
   * Handle Log Visit Navigation
   * Navigates to the log visit screen for the current participant
   */
  const handleLogVisitPress = () => {
    // @ts-ignore
    navigation.navigate('log-visit', { id: participantId });
  };



  /**
   * Render Status Badge
   * Shows red "Dropped Out" badge for dropout participants
   * 
   * @returns Badge component if status is 'dropout', null otherwise
   */
  const renderStatusBadge = () => {
    if (status === STATUS.DROPOUT) {
      return (
        <Box {...participantHeaderStyles.statusBadge}>
          <Text {...participantHeaderStyles.statusBadgeText}>
            {t('participantDetail.header.droppedOut')}
          </Text>
        </Box>
      );
    }
    return null;
  };

  /**
   * Render View Profile Button
   * Common button rendered for all statuses
   */
  const renderViewProfileButton = () => (
    <Button
      {...participantHeaderStyles.outlineButton}
      onPress={onViewProfile}
    >
      <HStack {...participantHeaderStyles.outlineButtonContent}>
        <LucideIcon name="User" size={16} color="#000" />
        <ButtonText {...participantHeaderStyles.outlineButtonText}>
          {t('participantDetail.header.viewProfile')}
        </ButtonText>
      </HStack>
    </Button>
  );

  /**
   * Render Second Action Button
   * Conditionally renders based on participant status
   */
  const renderSecondButton = () => {
    // Not Enrolled: Enroll Participant (disabled)
    if (status === STATUS.NOT_ENROLLED) {
      return (
        <Button
          {...participantHeaderStyles.solidButtonPrimary}
          onPress={() => {}}
          isDisabled={true}
          $md-width="auto"
        >
          <HStack {...participantHeaderStyles.solidButtonContent}>
            <LucideIcon name="User" size={16} color="#fff" />
            <ButtonText {...participantHeaderStyles.solidButtonText}>
              {t('participantDetail.header.enrollParticipant')}
            </ButtonText>
          </HStack>
        </Button>
      );
    }

    // Dropout: No second button
    if (status === STATUS.DROPOUT) {
      return null;
    }

    // Enrolled, In Progress, Completed: Log Visit
    return (
      <Button
        {...participantHeaderStyles.solidButtonPrimary}
        onPress={handleLogVisitPress}
        $md-width="auto"
      >
        <HStack {...participantHeaderStyles.solidButtonContent}>
          <LucideIcon name="FileText" size={16} color="#fff" />
          <ButtonText {...participantHeaderStyles.solidButtonText}>
            {t('participantDetail.header.logVisit')}
          </ButtonText>
        </HStack>
      </Button>
    );
  };

  /**
   * Render Action Buttons
   * Displays action buttons based on participant status
   * 
   * @returns Action buttons JSX based on status
   */
  const renderActionButtons = () => {
    const secondButton = renderSecondButton();

    // If there's a second button, wrap both in HStack
    if (secondButton) {
      return (
        <HStack
          {...participantHeaderStyles.actionButtonsContainer}
          $md-flexDirection="row"
          $md-width="auto"
        >
          {renderViewProfileButton()}
          {secondButton}
        </HStack>
      );
    }

    // Otherwise, just render View Profile button
    return renderViewProfileButton();
  };


  return (
    <VStack 
      {...participantHeaderStyles.container}
      // Responsive padding: keep mobile bottom padding, desktop uses default
    >
      {/* Back Navigation Link */}
      <Pressable onPress={handleBackPress}>
        <HStack {...participantHeaderStyles.backLinkContainer}>
          <Box mr="$2">
            <LucideIcon name="ArrowLeft" size={18} color={theme.tokens.colors.textForeground} />
          </Box>
          <Text 
            {...participantHeaderStyles.backLinkText}
            $hover={{
              color: '$primary500',
            }}
          >
            {t('participantDetail.header.backToCaseload')}
          </Text>
        </HStack>
      </Pressable>

      {/* Participant Info and Actions Row */}
      <HStack 
        {...participantHeaderStyles.participantInfoRow}
        // Responsive: stack on mobile, row on desktop
        $md-flexDirection="row"
        $md-justifyContent="space-between"
      >
        {/* Left: Participant Name and ID */}
        <VStack {...participantHeaderStyles.participantInfoContainer}>
          <HStack {...participantHeaderStyles.participantNameRow}>
            <Text {...participantHeaderStyles.participantName}>
              {participantName}
            </Text>
            {renderStatusBadge()}
          </HStack>
          
          <HStack {...participantHeaderStyles.participantIdRow}>
            <Text {...participantHeaderStyles.participantId}>
              {participantId}
            </Text>
            {pathway && (
              <>
                <Text {...participantHeaderStyles.pathwaySeparator}>
                  •
                </Text>
                <Text {...participantHeaderStyles.pathway}>
                  {t(`participantDetail.pathways.${pathway}`)}
                </Text>
              </>
            )}
          </HStack>
        </VStack>

        {/* Right: Action Buttons */}
        <Box width="$full" $md-width="auto">
          {renderActionButtons()}
        </Box>
      </HStack>

      {/* Participant Status Card/Warning */}
      <ParticipantProgressCard
        status={status}
        graduationProgress={graduationProgress}
        graduationDate={graduationDate}
      />

    </VStack>
  );
};

export default ParticipantHeader;
