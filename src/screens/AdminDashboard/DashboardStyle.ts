import { theme } from '@config/theme';

/**
 * DashboardCards Styles
 * Centralized styles for DashboardCards component
 */

export const dashboardCardsStyles = {
  cardsContainer: {
    flexWrap: 'wrap' as const,
    justifyContent: 'flex-start' as const,
    alignItems: 'stretch' as const, // Ensure all cards stretch to same height
    gap: '$4' as const, // Explicit gap for better control
  },
  pressable: {
    // Width is calculated dynamically in component based on number of cards
    minWidth: '$64' as const,
    display: 'flex' as const,
    alignItems: 'stretch' as const, // Ensure cards stretch to same height
    $sm: {
      flex: '0 0 100%' as any, // 1 card per row on small screens only
      width: '100%' as const,
      maxWidth: '100%' as const,
    },
    $web: {
      cursor: 'pointer' as const,
    },
  },
  card: {
    size: 'md' as const,
    variant: 'outline' as const,
    borderWidth: 2,
    borderColor: '$borderColor' as const,
    borderRadius: '$xl' as const,
    p: '$4' as const,
    height: '100%' as const, // Ensure all cards have same height
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  cardContent: {
    space: 'sm' as const,
    flex: 1,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    justifyContent: 'space-between' as const,
    height: '100%' as const,
  },
  iconTitleRow: {
    space: 'md' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
  },
  iconTitleContainer: {
    space: 'md' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  iconBox: {
    borderRadius: '$xl' as const,
    width: '$9' as const,
    height: '$9' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  iconBoxDefaultBg: '$bgPrimaryBorder/10' as const,
  iconColor: theme.tokens.colors.primary500,
  iconSize: 20,
  titleContainer: {
    flex: 1,
    space: 'xs' as const,
  },
  titleText: {
    fontSize: '$md' as const,
    fontWeight: '$normal' as const,
    color: '$textForeground' as const,
  },
  chevronIcon: {
    size: 20,
    color: '$textMutedForeground' as const,
  },
  chevronIconContainer: {
    bg: '#f6f3f4' as const,
    borderRadius: '$full' as const,
    p: '$2' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: '$7' as const,
    height: '$7' as const,
  },
  descriptionText: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
    flex: 1,
    lineHeight: '$sm' as const,
    fontWeight: '$normal' as const,
    minHeight: 40, // Ensure minimum height for consistency
  },
  badgeContainer: {
    justifyContent: 'flex-start' as const,
    alignItems: 'center' as const,
  },
  badge: {
    bg: '$textSecondary' as const,
    borderRadius: '$md' as const,
    px: '$2' as const,
    py: '$0.5' as const,
  },
  badgeText: {
    color: '$white' as const,
    fontSize: '$xs' as const,
    fontWeight: '$medium' as const,
  },
  infoCard: {
    size: 'md' as const,
    variant: 'ghost' as const,
    px: '$0' as const,
  },
  infoHeading: {
    size: 'md' as const,
    fontSize: '$md' as const,
    fontWeight: '$normal' as const,
    color: '$textForeground' as const,
  },
  infoText: {
    size: 'sm' as const,
    color: '$textMutedForeground' as const,
  },
};
