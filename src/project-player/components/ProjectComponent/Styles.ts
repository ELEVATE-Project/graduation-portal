export const projectComponentStyles = {
  container: {
    flex: 1,
    bg: '$backgroundLight0',
  },
  scrollView: {
    contentContainerStyle: { padding: 16 },
    showsVerticalScrollIndicator: true,
  },
  card: {
    size: 'lg' as const,
    variant: 'elevated' as const,
    bg: '$white',
    borderRadius: '$lg',
  },
  addTaskButtonContainer: {
    padding: '$5',
    paddingTop: '$3',
  },
} as const;

export const projectInfoCardStyles = {
  container: {
    bg: '$backgroundPrimary.light',
    padding: '$6',
  },
  header: {
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    width: '100%',
  },
  leftSection: {
    space: 'md' as const,
    flex: 1,
  },
  rightSection: {
    marginLeft: '$4',
  },
  stepsCompleteBadge: {
    bg: '$mutedForeground',
    borderRadius: '$full',
    paddingHorizontal: '$4',
    paddingVertical: '$2',
    shadowColor: '$backgroundLight900',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: '$4',
  },
  stepsCompleteText: {
    space: 'xs' as const,
    alignItems: 'center' as const,
  },
  taskCountPreview: {
    // Simple text container
  },
  progressContainer: {
    space: 'xs' as const,
    marginLeft: '$4',
    width: 120,
  },
  progressPercentage: {
    textAlign: 'right' as const,
  },
  progressBar: {
    size: 'sm' as const,
    bg: '$inputBorder',
  },
  progressFilledTrack: {
    bg: '$primary500',
  },
  pillarsCountContainer: {
    space: 'xs' as const,
    marginLeft: '$4',
    alignItems: 'flex-end' as const,
  },
} as const;
