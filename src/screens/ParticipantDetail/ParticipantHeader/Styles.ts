/**
 * ParticipantHeader Styles
 * Centralized styles for ParticipantHeader component
 */

import { STATUS } from '@constants/app.constant';

// Type for status card status values
type StatusCardStatus = typeof STATUS.IN_PROGRESS | typeof STATUS.COMPLETED | typeof STATUS.DROPOUT;

// Common status card base styles
const statusCardBase = {
  borderWidth: 1,
  borderRadius: '$2xl' as const,
  p: '$6' as const,
};

// Common card title style
const statusCardTitleBase = {
  fontSize: '$sm' as const,
  fontWeight: '$normal' as const,
  color: '$textMutedForeground' as const,
  lineHeight: '$sm' as const,
};

/**
 * Get status-specific card styles
 * Returns card styles based on participant status with common base styles
 */
export const getStatusCard = (status: StatusCardStatus) => {
  switch (status) {
    case STATUS.IN_PROGRESS:
      return {
        ...statusCardBase,
        borderColor: '$borderLight300' as const,
        bg: '$white' as const,
      };
    case STATUS.COMPLETED:
      return {
        ...statusCardBase,
        borderColor: '$success300' as const,
        bg: '$success50' as const,
      };
    case STATUS.DROPOUT:
      return {
        ...statusCardBase,
        borderColor: '$error200' as const,
        bg: '$error50' as const,
      };
    default:
      return statusCardBase;
  }
};

export const participantHeaderStyles = {
  // Container styles
  container: {
    space: 'md' as const,
    width: '$full' as const,
    pt: '$6' as const,
    pb: '$6' as const, // Mobile: increased bottom padding
  },

  // Back navigation link
  backLinkContainer: {
    alignItems: 'center' as const,
    paddingHorizontal: '$2' as const,
    height: '$8' as const,
  },
  backLinkText: {
    fontSize: '$sm' as const,
    color: '$textForegroundColor' as const,
    fontWeight: '$medium' as const,
  },

  // Participant info row
  participantInfoRow: {
    justifyContent: 'flex-start' as const, // Mobile: start alignment
    alignItems: 'flex-start' as const,
    flexDirection: 'column' as const, // Mobile: stack vertically (overridden by $md-flexDirection="row")
    width: '$full' as const,
    flexWrap: 'wrap' as const,
    gap: '$3' as const, // Mobile: smaller gap
    marginBottom: '$3' as const,
  },

  // Participant name and ID section
  participantInfoContainer: {
    flex: 1,
    space: 'xs' as const,
  },
  participantNameRow: {
    space: 'md' as const,
    alignItems: 'center' as const,
    flexWrap: 'wrap' as const,
  },
  participantName: {
    fontSize: '$md' as const,
    fontWeight: '$normal' as const,
    color: '$textForegroundColor' as const,
    lineHeight: '$lg' as const,
    marginBottom: '$1' as const,
  },
  participantIdRow: {
    space: 'lg' as const,
    alignItems: 'center' as const,
  },
  participantId: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
  },
  pathwaySeparator: {
    fontSize: '$md' as const,
    color: '$textMutedForeground' as const,
  },
  pathway: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
  },

  // Status badge
  statusBadge: {
    bg: '$bgDestructive' as const,
    borderRadius: '$xl' as const,
    px: '$2' as const,
    py: '$0.5' as const,
    ml: '$3' as const,
   
  },
  statusBadgeText: {
    fontSize: '$xs' as const,
    fontWeight: '$medium' as const,
    color: '$white' as const,
    lineHeight: '$xs' as const,
  },

  // Action buttons
  actionButtonsContainer: {
    space: 'md' as const,
    alignItems: 'stretch' as const, // Mobile: stretch to full width
    flexDirection: 'column' as const, // Mobile: stack buttons vertically (overridden by $md-flexDirection="row")
    width: '$full' as const, // Mobile: full width buttons (overridden by $md-width="auto")
    gap: '$3' as const, // Mobile: smaller gap
  },
  outlineButton: {
    variant: 'outline' as const,
    size: 'md' as const,
    borderColor: '$borderLight300' as const,
    bg: '$white' as const,
    borderRadius: '$xl' as const,
    height: '$9' as const,
    paddingHorizontal: '$3' as const,
    paddingVertical: '$2' as const,
    width: '$full' as const,
    minWidth: 120 as const,
    '$md-width': 'auto' as const,
  },
  outlineButtonContent: {
    space: 'sm' as const,
    alignItems: 'center' as const,
  },
  outlineButtonText: {
    color: '$textForegroundColor' as const,
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
  },
  solidButtonPrimary: {
    variant: 'solid' as const,
    size: 'md' as const,
    bg: '$primary500' as const,
    borderRadius: '$xl' as const,
    height: '$9' as const,
    paddingHorizontal: '$3' as const,
    paddingVertical: '$2' as const,
    width: '$full' as const, // Mobile: full width
    minWidth: 120 as const, // Desktop: minimum width
  },
  solidButtonError: {
    variant: 'solid' as const,
    size: 'md' as const,
    bg: '$error600' as const,
  },
  solidButtonContent: {
    space: 'sm' as const,
    alignItems: 'center' as const,
  },
  solidButtonText: {
    color: '$white' as const,
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
  },

  // Common status card styles (shared across all status cards)
  statusCardBoxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px',
  statusCardBackgroundImage: 'linear-gradient(to right bottom, oklch(0.984 0.003 247.858) 0%, rgb(255, 255, 255) 50%, oklab(0.984 -0.00113071 -0.00277876 / 0.5) 100%)',

  // Dropout warning box (kept for backward compatibility, uses getStatusCard now)
  dropoutWarningBox: {
    bg: '$error50' as const,
    borderWidth: 1,
    borderColor: '$error200' as const,
    borderRadius: '$2xl' as const,
    p: '$6' as const,
  },
  dropoutWarningContent: {
    space: 'md' as const,
    alignItems: 'flex-start' as const,
  },
  dropoutWarningIcon: {
  
  },
  dropoutWarningIconText: {
    color: '$white' as const,
    fontSize: '$xs' as const,
    fontWeight: '$bold' as const,
  },
  dropoutWarningTextContainer: {
    flex: 1,
    space: 'xs' as const,
  },
  dropoutWarningTitle: {
    color: '$error900' as const,
    fontSize: '$md' as const,
    fontWeight: '$medium' as const,
    lineHeight: '$md' as const,
  },
  dropoutWarningMessage: {
    color: '$error600' as const,
    fontSize: '$sm' as const,
  },

  // Common card title style (used by both progress and completed cards)
  statusCardTitle: statusCardTitleBase,
  progressCardContent: {
    // Mobile: vertical stacking (default)
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    width: '$full' as const,
    // Desktop: horizontal layout (overridden by $md-* props in component)
  },
  progressPercentage: {
    fontSize: '$2xl' as const,
    fontWeight: '$normal' as const,
    color: '$textForegroundColor' as const,
    minWidth: 60,
    lineHeight: '$xl' as const,
  },
  progressBarContainer: {
    flex: 1,
    maxWidth: 448, // Desktop: limit width
    width: '$full' as const, // Mobile: full width
  },
  progressBarBackground: {
    height: '$3' as const,
    bg: '$progressBarBackground' as const,
    borderRadius: '$full' as const,
    overflow: 'hidden' as const,
  },
  progressBarFill: {
    height: '$full' as const,
    bg: '$progressBarFillColor' as const,
    borderRadius: '$full' as const,
  },

  // In Progress specific styles
  progressCardTitle: {
    ...statusCardTitleBase,
    mb: '$2' as const,
  },
  // Completed specific styles
  completedCardTitle: statusCardTitleBase,
  completedCardContent: {
    space: 'md' as const,
    alignItems: 'center' as const,
  },
  completedStatus: {
    fontSize: '$md' as const,
    fontWeight: '$normal' as const,
    color: '$success600' as const,
    lineHeight: '$md' as const,
  },
  completedDate: {
    fontSize: '$xs' as const,
    color: '$textMutedForeground' as const,
    lineHeight: '$sm' as const,
  },

} as const;

