import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, Text, Pressable, Box, VStack, Input, InputField, Modal } from '@ui';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon, Menu } from '@ui';
import { Participant } from '@app-types/screens';
import { styles as dataTableStyles } from '@components/DataTable/Styles';
import { getParticipantsMenuItems } from '@constants/PARTICIPANTS_LIST';

interface ActionColumnProps {
  participant: Participant;
}

/**
 * Custom trigger for actions menu
 */
const getCustomTrigger = (triggerProps: any) => (
  <Pressable {...triggerProps} {...dataTableStyles.customTrigger}>
    <LucideIcon
      name="MoreVertical"
      size={20}
      color={theme.tokens.colors.textForeground}
    />
  </Pressable>
);

/**
 * ActionColumn Component
 * Manages all action column functionality: View Details button, Actions menu, and Dropout modal
 */
export const ActionColumn: React.FC<ActionColumnProps> = ({ participant }) => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  // Dropout modal state - selectedParticipant controls modal visibility (null = closed, not null = open)
  const [dropoutReason, setDropoutReason] = useState('');
  const [showDropoutModal, setShowDropoutModal] = useState(false);

  const handleViewDetails = () => {
    // @ts-ignore - Navigation type inference
    navigation.navigate('participant-detail', { id: participant.id });
  };

  const handleMenuSelect = (key: string) => {
    const participantId = participant.id;
    
    switch (key) {
      case 'view-log':
        // @ts-ignore - Navigation type inference
        navigation.navigate('participant-detail', { id: participantId });
        break;
      case 'log-visit':
        // @ts-ignore - Navigation type inference
        navigation.push('log-visit', { participantId });
        break;
      case 'dropout':
        setShowDropoutModal(true);
        break;
      default:
        console.log('Action:', key, 'for participant:', participantId);
    }
  };

  const handleDropoutConfirm = useCallback((reason?: string) => {
    console.log('Dropout participant:', participant.id, 'Reason:', reason);
    // TODO: Implement dropout logic - API call to mark participant as dropout with reason
    
    // Close modal and reset state
    setDropoutReason('');
    setShowDropoutModal(false);
  }, [participant.id]);

  const handleCloseDropoutModal = useCallback(() => {
    setDropoutReason('');
    setShowDropoutModal(false);
  }, []);

  return (
    <Box>
      <HStack {...dataTableStyles.cardActionsSection}>
        <Pressable
          onPress={handleViewDetails}
          {...dataTableStyles.viewDetailsButton}
        >
          <HStack space="sm" alignItems="center" justifyContent="center">
            <LucideIcon
              name="Eye"
              size={18}
              color={theme.tokens.colors.textForeground}
            />
            <Text
              {...TYPOGRAPHY.bodySmall}
              color="$textForeground"
              fontWeight="$medium"
            >
              {t('actions.viewDetails')}
            </Text>
          </HStack>
        </Pressable>
        <Menu
          items={getParticipantsMenuItems(t)}
          placement="bottom right"
          offset={5}
          trigger={getCustomTrigger}
          onSelect={handleMenuSelect}
        />
      </HStack>

      {/* Dropout Confirmation Modal */}
      <Modal
        isOpen={showDropoutModal}
        onClose={handleCloseDropoutModal}
        headerTitle={t('actions.confirmDropout') || 'Confirm Dropout'}
        headerIcon={
          <LucideIcon
            name="UserX"
            size={24}
            color={theme.tokens.colors.error.light}
          />
        }
        maxWidth={500}
        cancelButtonText={t('common.cancel') || 'Cancel'}
        confirmButtonText={t('actions.confirmDropout') || 'Confirm Dropout'}
        onCancel={handleCloseDropoutModal}
        onConfirm={() => handleDropoutConfirm(dropoutReason)}
        confirmButtonColor="$error500"
      >
        <VStack space="lg">
          <Text
            {...TYPOGRAPHY.paragraph}
            color="$textSecondary"
            lineHeight="$xl"
          >
            {t('actions.dropoutMessage', { name: participant.name || participant.id || 'participant' }) ||
              `Mark ${participant.name || participant.id || 'participant'} as dropout from the program`}
          </Text>

          <VStack space="sm">
            <Text
              {...TYPOGRAPHY.label}
              color="$textPrimary"
              fontWeight="$medium"
            >
              {t('actions.dropoutReasonLabel') || 'Reason for Dropout'}
            </Text>
            <Input
              {...dataTableStyles.modalInput}
              borderColor="$inputBorder"
              bg="$modalBackground"
              $focus-borderColor="$inputFocusBorder"
              $focus-borderWidth={2}
            >
              <InputField
                placeholder={
                  t('actions.dropoutReasonPlaceholder') || 'Enter reason for dropout...'
                }
                value={dropoutReason}
                onChangeText={setDropoutReason}
                {...dataTableStyles.modalInputField}
                placeholderTextColor="$textMutedForeground"
              />
            </Input>
            <Text
              {...TYPOGRAPHY.bodySmall}
              color="$textSecondary"
              lineHeight="$sm"
            >
              {t('actions.dropoutHint') ||
                'This will change the participant\'s status to "Not Enrolled" and log the action in their history.'}
            </Text>
          </VStack>
        </VStack>
      </Modal>
    </Box>
  );
};

