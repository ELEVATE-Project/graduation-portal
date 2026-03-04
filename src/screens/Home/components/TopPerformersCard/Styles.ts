export const topPerformersCardStyles = {
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
  performerItem: {
    borderWidth: 1,
    borderColor: '$borderLight200' as const,
    borderRadius: '$lg' as const,
    p: '$3' as const,
    bg: '$backgroundLight50' as const,
  },
  performerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performerLeft: {
    alignItems: 'center' as const,
    space: 'sm' as const,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    bg: '$error50' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  rankText: {
    fontSize: '$xs' as const,
    fontWeight: '$bold' as const,
    color: '$primary600' as const,
  },
  performerInfo: {
    flex: 1,
    space: 'xs',
  },
  performerRight: {
    alignItems: 'center' as const,
  },
  progressBar: {
    borderRadius: '$full',
  },
} as const;

