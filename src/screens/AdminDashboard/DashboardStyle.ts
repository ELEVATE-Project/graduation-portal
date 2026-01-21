import { theme } from '@config/theme';

/**
 * DashboardCards Styles
 * Centralized styles for DashboardCards component
 */

export const dashboardCardsStyles = {
  cardsContainer: {
    space: 'md' as const,
    flexWrap: 'wrap' as const,
  },
  pressable: {
    flex: 1,
    minWidth: '$64' as const,
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
    $web: {
      hover: {
        borderColor: '$primary500' as const,
        shadowColor: '$foreground' as const,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
    },
  },
  cardContent: {
    space: 'sm' as const,
    flex: 1,
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
  descriptionText: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
    flex: 1,
    lineHeight: '$sm' as const,
    fontWeight: '$normal' as const,
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
};
