import { theme } from '@config/theme';

/**
 * Common Modal Container Styles
 * Applied to Modal component itself
 */
export const commonModalContainerStyles = {
  alignItems: 'center' as const,
  display: 'flex' as const,
  height: '$full' as const,
  width: '$full' as const,
  $web: {
    position: 'fixed' as const,
  },
} as const;

/**
 * Common Web Positioning Styles for Modal Content
 * Applied to both confirmation and profile variants
 */
export const commonModalWebStyles = {
  $web: {
    position: 'fixed !important' as const,
    top: '50% !important' as const,
    left: '50% !important' as const,
    transform: 'translate(-50%, -50%) !important' as const,
    margin: '0 !important' as const,
  },
} as const;

/**
 * Common Modal Content Base Styles
 * Shared styles for both confirmation and profile variants
 */
export const commonModalContentStyles = {
  borderRadius: '$xl' as const,
  bg: '$bgSidebar' as const,
  shadowColor: '$black' as const,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 24,
  marginHorizontal: '$4' as const,
  marginVertical: 'auto' as const,
  alignSelf: 'center' as const,
  ...commonModalWebStyles,
} as const;

/**
 * Profile Variant Styles for Modal
 * Styles specific to profile variant display
 */
export const profileStyles = {
  modalContent: {
    ...commonModalContentStyles,
  },
  modalHeader: {
    borderBottomWidth: 0,
    padding: '$6' as const,
    paddingBottom: '$4' as const,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  modalTitle: {
    fontSize: '$lg' as const,
    fontWeight: '$semibold' as const,
    color: '$textForeground' as const,
  },
  modalSubtitle: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
  },
  modalBody: {
    paddingHorizontal: '$6' as const,
    paddingTop: '$4' as const,
    paddingBottom: '$6' as const,

  },
  fieldLabel: {
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
    color: '$textMutedForeground' as const,
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: '$sm' as const,
    color: '$textForeground' as const,
    lineHeight: '$sm' as const,
    fontWeight: '$normal' as const,
  },
  fieldSection: {
    borderBottomWidth: 1,
    borderBottomColor: '$borderLight200' as const,
    paddingBottom: '$4' as const,
  },
  input: {
    variant: 'outline' as const,
    size: 'md' as const,
    borderWidth: 1,
    borderColor: 'transparent' as const,
    borderRadius: '$md' as const,
    bg: '$white' as const,
  },
} as const;

/**
 * Modal Textarea Input Styles
 * Styles for textarea input in confirmation modals
 */
export const modalTextareaInputStyles = {
  variant: 'outline' as const,
  size: 'lg' as const,
  borderWidth: 2,
  borderColor: theme.tokens.colors.inputBorder,
  borderRadius: '$md' as const,
  bg: theme.tokens.colors.modalBackground,
  '$focus-borderColor': theme.tokens.colors.inputFocusBorder,
  '$focus-borderWidth': 2,
  minHeight: 80,
} as const;

