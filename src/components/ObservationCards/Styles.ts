import { theme } from '@config/theme';

/**
 * AssessmentCard Styles
 * Centralized styles for AssessmentCard component
 */

// Common button base styles shared by primary and secondary variants
const buttonBaseStyles = {
  borderRadius: '$xl' as const,
  px: '$4' as const,
  py: '$3' as const,
  alignSelf: 'flex-start' as const,
};

// Common status badge base styles
const statusBadgeBaseStyles = {
  borderRadius: '$full' as const,
  px: '$3' as const,
  py: '$1' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

// Status badge with icon (for graduated, completed, and not-started)
const statusBadgeWithIconStyles = {
  ...statusBadgeBaseStyles,
  flexDirection: 'row' as const,
  gap: '$1' as const,
};

export const assessmentSurveyCardStyles = {
  statusBadgeActive: {
    ...statusBadgeBaseStyles,
    bg: theme.tokens.colors.primary500,
  },
  statusBadgeInactive: {
    ...statusBadgeBaseStyles,
    bg: theme.tokens.colors.textMutedForeground,
  },
  cardContainer: {
    bg: '$white',
    borderWidth: 1,
    borderColor: '$borderLight200',
    borderRadius: '$2xl',
    p: '$6',
    width: '$full',
    space: '$4',
    elevation: 0, // Remove shadow on React Native
  },
  cardHeader: {
    width: '$full',
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  iconContainer: {
    width: '$12',
    height: '$12',
    borderRadius: '$2xl',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: '$white',
  },
  title: {
    fontSize: '$md',
    fontWeight: '$normal',
    color: '$textForeground',
    flex: 1,
  },
  statusBadgeNotStarted: {
    ...statusBadgeWithIconStyles,
    bg: theme.tokens.colors.textMutedForeground,
  },
  statusBadgeInProgress: {
    ...statusBadgeBaseStyles,
    bg: theme.tokens.colors.textMutedForeground,
  },
  statusBadgeCompleted: {
    ...statusBadgeWithIconStyles,
    bg: '$white',
    borderWidth: 1,
    borderColor: theme.tokens.colors.success600,
  },
  statusBadgeGraduated: {
    ...statusBadgeWithIconStyles,
    bg: theme.tokens.colors.success600,
  },
  statusBadgeText: {
    fontSize: '$xs',
    fontWeight: '$medium',
    color: '$white',
    $web: {
      whiteSpace: 'nowrap' as const,
    },
  },
  statusBadgeTextCompleted: {
    fontSize: '$xs',
    fontWeight: '$medium',
    color: '$success600',
    $web: {
      whiteSpace: 'nowrap' as const,
    },
  },
  statusBadgeTextGraduated: {
    fontSize: '$xs',
    fontWeight: '$medium',
    color: '$white',
    $web: {
      whiteSpace: 'nowrap' as const,
    },
  },
  contentContainer: {
    mb: '$4',
  },
  description: {
    fontSize: '$md',
    color: '$textMutedForeground',
    lineHeight: '$md',
  },
  additionalInfo: {
    fontSize: '$sm',
    color: '$textMutedForeground',
    fontStyle: 'normal' as const,
    lineHeight: '$sm',
  },
  buttonPrimary: {
    ...buttonBaseStyles,
    bg: theme.tokens.colors.primary500,
  },
  buttonSecondary: {
    ...buttonBaseStyles,
    bg: '$backgroundLight50',
    borderWidth: 1,
    borderColor: '$borderLight200',
  },
  buttonText: {
    fontSize: '$sm',
    fontWeight: '$medium',
  },
} as const;

