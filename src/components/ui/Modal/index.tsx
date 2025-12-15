import React from 'react';
import {
  Modal as GluestackModal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  VStack,
  Text,
  Heading,
  Box,
  CloseIcon,
  Icon as GluestackIcon,
  Button,
  ButtonText,
  ScrollView,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { Pressable } from 'react-native';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { useLanguage } from '@contexts/LanguageContext';
import { ModalProps } from '@app-types/components';
import { LucideIcon } from '@ui';
import { usePlatform } from '@utils/platform';
import { profileStyles, commonModalContentStyles, commonModalContainerStyles, modalTextareaInputStyles } from './Styles';
import Select from '../Inputs/Select';
import { PROVINCES } from '@constants/PARTICIPANTS_LIST';
import { getSitesByProvince } from '../../../services/participantService';

/**
 * Modal Component
 * 
 * A flexible modal component using Gluestack UI Modal with:
 * - Header: Supports title, description, and icon section
 * - Body: Flexible content via children prop
 * - Footer: Optional - only displays if footerContent is provided
 * 
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   headerTitle="Modal Title"
 *   headerDescription="Optional description text"
 *   headerIcon={<LucideIcon name="Info" />}
 *   footerContent={
 *     <HStack space="md">
 *       <Button onPress={onCancel}>Cancel</Button>
 *       <Button onPress={onConfirm}>Confirm</Button>
 *     </HStack>
 *   }
 * >
 *   <Text>Modal body content</Text>
 * </Modal>
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = 'md',
  // Header props
  headerTitle,
  headerDescription,
  headerIcon,
  showCloseButton = true,
  // Body props
  children,
  // Footer props
  footerContent,
  cancelButtonText,
  confirmButtonText,
  onCancel,
  onConfirm,
  confirmButtonColor = theme.tokens.colors.primary500,
  confirmButtonVariant = 'solid',
  // Profile props
  profile,
  onAddressEdit,
  isEditingAddress = false,
  editedAddress,
  onAddressChange,
  onSaveAddress,
  onCancelEdit,
  isSavingAddress = false,
  // Additional styling
  maxWidth,
  contentProps,
  closeOnOverlayClick = true,

  ...modalProps // Spread all other Gluestack Modal props
}) => {
  const { t } = useLanguage();
  const { isWeb } = usePlatform();

  // Determine if footer should be shown
  const hasFooter = footerContent || cancelButtonText || confirmButtonText;

  // Handle cancel - use onCancel if provided, otherwise use onClose
  const handleCancel = onCancel || onClose;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  // Profile Variant Rendering
  if (profile) {
    return (
      <GluestackModal
        isOpen={isOpen}
        onClose={onClose}
        size={isWeb ? "sm" : "lg"}
        {...commonModalContainerStyles}
      >
        <ModalBackdrop />
        <ModalContent
          {...profileStyles.modalContent}
        >
          <ModalHeader {...profileStyles.modalHeader}>
            <VStack space="sm" flex={1}>
              {headerTitle && (
                <Text {...profileStyles.modalTitle}>
                  {typeof headerTitle === 'string' ? t(headerTitle) : headerTitle}
                </Text>
              )}
              {headerDescription && (
                <Text {...profileStyles.modalSubtitle}>
                  {typeof headerDescription === 'string' ? t(headerDescription) : headerDescription}
                </Text>
              )}
            </VStack>
            <Pressable onPress={onClose}>
              <LucideIcon
                name="X"
                size={20}
                color='$textForeground'
              />
            </Pressable>
          </ModalHeader>

          <ModalBody {...profileStyles.modalBody}>
            <VStack space="lg">
              {/* Name Field */}
              <VStack space="xs" {...profileStyles.fieldSection}>
                <Text {...profileStyles.fieldLabel}>
                  {t('common.profileFields.name')}
                </Text>
                <Text {...profileStyles.fieldValue}>
                  {profile.name}
                </Text>
              </VStack>

              {/* ID Field */}
              <VStack space="xs" {...profileStyles.fieldSection}>
                <Text {...profileStyles.fieldLabel}>
                  {t('common.profileFields.id')}
                </Text>
                <Text {...profileStyles.fieldValue}>
                  {profile.id}
                </Text>
              </VStack>

              {/* Contact Section */}
              <VStack space="xs" {...(profile.address ? profileStyles.fieldSection : {})}>
                <Text {...profileStyles.fieldLabel}>
                  {t('common.profileFields.contact')}
                </Text>
                <VStack space="sm">
                  <Text {...profileStyles.fieldValue}>
                    {profile.contact}
                  </Text>
                  <Text {...profileStyles.fieldValue}>
                    {profile.email}
                  </Text>
                </VStack>
              </VStack>

              {/* Address Section */}
              {profile.address && (
                <VStack space="xs">
                  {!isEditingAddress ? (
                    <>
                      <HStack alignItems="center" justifyContent="space-between">
                        <Text {...profileStyles.fieldLabel}>
                          {t('common.profileFields.address')}
                        </Text>
                        {onAddressEdit && (
                          <Pressable onPress={onAddressEdit}>
                            <LucideIcon
                              name="Pencil"
                              size={16}
                              color='$primary500'
                            />
                          </Pressable>
                        )}
                      </HStack>
                      <Text {...profileStyles.fieldValue}>
                        {profile.address}
                      </Text>
                    </>
                  ) : (
                    <VStack space="sm">
                      {/* Street Address Input */}
                      <VStack space="xs">

                        <Text {...profileStyles.fieldLabel}>
                          {t('common.profileFields.address')}
                        </Text>
                        <Input
                          {...profileStyles.input}
                          $focus-borderColor={theme.tokens.colors.inputFocusBorder}
                        >
                          <InputField
                            placeholder={t('common.profileFields.addressFields.street')}
                            value={editedAddress?.street || ''}
                            onChangeText={(value: string) => onAddressChange?.('street', value)}
                          />
                        </Input>
                      </VStack>

                      {/* Province Dropdown */}
                      <VStack space="xs">
                        {/* <Text {...profileStyles.fieldLabel}>
                          {t('common.profileFields.addressFields.province')}
                        </Text> */}
                        <Select
                          options={PROVINCES.map(p => ({ label: p.label, value: p.value }))}
                          value={editedAddress?.province || ''}
                          onChange={(value) => onAddressChange?.('province', value)}
                          placeholder={t('participantDetail.profileModal.selectProvince')}
                          bg="$white" borderColor="transparent"
                        />
                      </VStack>

                      {/* Site Dropdown */}
                      <VStack space="xs">
                        {/* <Text {...profileStyles.fieldLabel}>
                          {t('common.profileFields.addressFields.site')}
                        </Text> */}
                        <Select
                          options={getSitesByProvince(editedAddress?.province || '').map(s => ({
                            label: s.label,
                            value: s.value
                          }))}
                          value={editedAddress?.site || ''}
                          onChange={(value) => onAddressChange?.('site', value)}
                          placeholder={t('participantDetail.profileModal.selectSite')}
                          bg="$white"
                          borderColor="transparent"
                        />
                      </VStack>
                    </VStack>
                  )}
                </VStack>
              )}
            </VStack>
          </ModalBody>

          {/* Footer with Edit Mode Buttons */}
          {isEditingAddress && (
            <ModalFooter borderTopWidth={0} padding="$6" paddingTop="$4">
              <HStack space="md" width="$full" justifyContent="flex-end">
                {/* Cancel Button */}
                <Button
                  variant="outline"
                  onPress={onCancelEdit}
                  borderWidth={1}
                  borderColor={theme.tokens.colors.inputBorder}
                  bg={theme.tokens.colors.modalBackground}
                  paddingHorizontal="$6"
                  paddingVertical="$3"
                  borderRadius="$md"
                  $hover-bg={theme.tokens.colors.hoverBackground}
                  $web-cursor="pointer"
                  isDisabled={isSavingAddress}
                >
                  <ButtonText
                    color={theme.tokens.colors.textPrimary}
                    {...TYPOGRAPHY.button}
                  >
                    {t('common.cancel')}
                  </ButtonText>
                </Button>

                {/* Save Location Button */}
                <Button
                  variant="solid"
                  bg={theme.tokens.colors.primary500}
                  onPress={onSaveAddress}
                  paddingHorizontal="$6"
                  paddingVertical="$3"
                  borderRadius="$md"
                  $hover-bg={theme.tokens.colors.primary500}
                  $hover-opacity={0.9}
                  $web-cursor="pointer"
                  isDisabled={isSavingAddress || !editedAddress?.street || !editedAddress?.province || !editedAddress?.site}
                  opacity={isSavingAddress ? 0.5 : 1}
                >
                  <ButtonText color={theme.tokens.colors.modalBackground}>
                    {isSavingAddress ? t('common.loading') : t('participantDetail.profileModal.saveLocation')}
                  </ButtonText>
                </Button>
              </HStack>
            </ModalFooter>
          )}
        </ModalContent>
      </GluestackModal>
    );
  }

  // Standard/Confirmation Variant Rendering
  return (
    <GluestackModal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      closeOnOverlayClick={closeOnOverlayClick}
      {...commonModalContainerStyles}
      {...modalProps} // Pass through all Gluestack Modal props
    >
      <ModalBackdrop />
      <ModalContent
        {...commonModalContentStyles}
        {...(maxWidth && { maxWidth: `${maxWidth}px` })}
        {...contentProps} maxHeight="100%"
      >
        {/* Header with Title, Description, and Icon */}
        {(headerTitle || headerDescription || headerIcon || showCloseButton) && (
          <ModalHeader borderBottomWidth={0} padding="$6" paddingBottom="$4">
            <HStack space="md" alignItems="center" flex={1}>
              {/* Header Icon Section */}
              {headerIcon && (
                <Box {...profileStyles.headerIconContainer}>
                  {headerIcon}
                </Box>
              )}

              {/* Title and Description */}
              {(headerTitle || headerDescription) && (
                <VStack flex={1} space="xs">
                  {headerTitle && (
                    <Heading
                      {...TYPOGRAPHY.h3}
                      color={theme.tokens.colors.textPrimary}
                    >
                      {typeof headerTitle === 'string' ? t(headerTitle) : headerTitle}
                    </Heading>
                  )}
                  {headerDescription && (
                    <Text
                      {...TYPOGRAPHY.paragraph}
                      color={theme.tokens.colors.textSecondary}
                      fontSize="$sm"
                    >
                      {typeof headerDescription === 'string' ? t(headerDescription) : headerDescription}
                    </Text>
                  )}
                </VStack>
              )}

              {/* Close Button */}
              {showCloseButton && (
                <Pressable onPress={onClose} accessibilityLabel={t('common.close')} accessibilityRole="button">
                  <Box
                    padding="$2"
                    borderRadius="$sm"
                    $web-cursor="pointer"
                    sx={{
                      ':hover': {
                        bg: '$backgroundLight100',
                      },
                    }}
                  >
                    <GluestackIcon as={CloseIcon} size="xl" color="$textLight600" />
                  </Box>
                </Pressable>
              )}
            </HStack>
          </ModalHeader>
        )}

        {/* Flexible Body Content */}
        <ModalBody padding="$6" paddingTop={headerTitle || headerDescription || headerIcon ? "$2" : "$6"} paddingBottom={hasFooter ? "$4" : "$6"}>
          <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>{children}</ScrollView>
        </ModalBody>

        {/* Optional Footer - Shows if footerContent or button texts are provided */}
        {hasFooter && (
          <ModalFooter borderTopWidth={0} padding="$6" paddingTop="$4">
            {footerContent ? (
              footerContent
            ) : (
              <HStack space="md" width="$full" justifyContent="flex-end">
                {/* Cancel Button */}
                {cancelButtonText && (
                  <Button
                    {...profileStyles.cancelButton}
                    onPress={handleCancel}
                  >
                    <ButtonText color={theme.tokens.colors.textPrimary} {...TYPOGRAPHY.button}>
                      {typeof cancelButtonText === 'string' ? t(cancelButtonText) : cancelButtonText}
                    </ButtonText>
                  </Button>
                )}
                {/* Confirm Button */}
                {confirmButtonText && onConfirm && (
                  <Button
                    {...profileStyles.confirmButton}
                    variant={confirmButtonVariant}
                    bg={confirmButtonColor}
                    onPress={onConfirm}
                    $hover-bg={confirmButtonColor}
                  >
                    <ButtonText color={theme.tokens.colors.modalBackground} {...TYPOGRAPHY.button}>
                      {typeof confirmButtonText === 'string' ? t(confirmButtonText) : confirmButtonText}
                    </ButtonText>
                  </Button>
                )}
              </HStack>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </GluestackModal>
  );
};

// Export ModalComponent as Modal
export default Modal;

