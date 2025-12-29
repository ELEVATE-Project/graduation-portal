
/**
 * Styles for ParticipantsList screen component
 * Centralized style definitions for better maintainability
 */
export const styles = {
  // Main container
  mainContainer: {
    flex: 1 as const,
  },

  // ScrollView
  scrollView: {
    flex: 1 as const,
    bg: '$accent100',
  },

  // Header VStack
  headerVStack: {
    bg: '$white' as const,
  },

  // Heading
  heading: {
    padding: '$4' as const,
    my: '$2' as const,
  },

  // Content container VStack
  contentVStack: {
    space: 'lg' as const,
    padding: '$0' as const,
    $md: {
      padding: '$6' as const,
    },
    flex: 1 as const,
  },

  // Search bar and filter HStack
  searchFilterHStack: {
    space: 'md' as const,
    width: '$full' as const,
    alignItems: 'center' as const,
  },

  // Search bar container
  searchBarContainer: {
    flex: 1 as const,
  },

  // Active/Inactive select container
  selectContainer: {
    width: '$40' as const,
    $md: {
      width: '$48' as const,
    },
  },

  // Select component
  select: {
    bg: '$white' as const,
    borderColor: '$borderLight300' as const,
  },

  // Mobile status select container
  mobileStatusSelectContainer: {
    width: '$full' as const,
  },

  // Desktop filter container
  desktopFilterContainer: {
    bg: '$backgroundLight50' as const,
    borderRadius: '$lg' as const,
    padding: '$1' as const,
    width: '$full' as const,
  },

  // Desktop filter HStack
  desktopFilterHStack: {
    space: 'xs' as const,
    width: '$full' as const,
  },

  // Status item Pressable
  statusItemPressable: {
    flex: 1 as const,
    paddingVertical: '$3' as const,
    paddingHorizontal: '$2' as const,
    borderRadius: '$md' as const,
    $web: {
      cursor: 'pointer' as const,
      transition: 'all 0.2s' as const,
    },
    sx: {
      ':hover': {
        opacity: 0.8,
      },
    },
  },

  // Status item Pressable - Active state
  statusItemPressableActive: {
    bg: '$white' as const,
  },

  // Status item Pressable - Inactive state
  statusItemPressableInactive: {
    bg: 'transparent' as const,
  },

  // Status item inner HStack
  statusItemHStack: {
    space: 'xs' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Status label Text
  statusLabelText: {
    fontSize: '$md' as const,
    fontWeight: '$normal' as const,
    textAlign: 'center' as const,
  },

  // Status label Text - Active state
  statusLabelTextActive: {
    color: '$primary500',
  },

  // Status label Text - Inactive state
  statusLabelTextInactive: {
    color: '$mutedForeground',
  },

  // Count badge Box
  countBadgeBox: {
    borderRadius: '$full' as const,
    paddingHorizontal: '$2' as const,
    paddingVertical: '$0.5' as const,
    minWidth: 24 as const,
    height: 20 as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Count badge Box - Active state
  countBadgeBoxActive: {
    bg: '$iconBackground',
  },

  // Count badge Box - Inactive state
  countBadgeBoxInactive: {
    bg: '$backgroundLight200',
  },

  // Count Text
  countText: {
    fontSize: '$xs' as const,
    fontWeight: '$normal' as const,
  },

  // Count Text - Active state
  countTextActive: {
    color: '$primary500',
  },

  // Count Text - Inactive state
  countTextInactive: {
    color: '$textMutedForeground',
  },

  // Status Badge Box
  statusBadgeBox: {
    borderWidth: 1 as const,
    paddingHorizontal: '$2' as const,
    paddingVertical: '$1' as const,
    borderRadius: '$full' as const,
    alignSelf: 'flex-start' as const,
    flexShrink: 0 as const,
  },

  // Status Badge Text
  statusBadgeText: {
    fontSize: '$xs' as const,
    fontWeight: '$medium' as const,
    numberOfLines: 1 as const,
  },
} as const;

