export const needsAttentionCardStyles = {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    space: 'md',
  },
  participantItem: {
    borderWidth: 1,
    borderRadius: '$lg' as const,
    p: '$3' as const,
  },
  participantRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantInfo: {
    flex: 1,
    space: 'xs',
  },
  participantRight: {
    alignItems: 'center' as const,
  },
  progressBar: {
    borderRadius: '$full',
  },
} as const;

