export const tasksOverviewCardStyles = {
  container: {
    flex: 1,
    height: '100%',
    bg: '$white',
    borderRadius: '$xl',
    p: '$4',
    borderWidth: 1,
    borderColor: '$borderColor',
  },
  header: {
    space: 'sm',
    alignItems: 'center',
    mb: '$4',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: '$md',
    bg: '$primary100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    space: 'md',
  },
  metricRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSection: {
    space: 'sm',
  },
  progressBar: {
    borderRadius: '$full',
  },
} as const;

