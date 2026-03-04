export const metricCardStyles = {
  container: {
    width: '100%',
    bg: '$white',
    borderRadius: '$xl',
    p: '$4',
    borderWidth: 1,
    borderColor: '$borderColor',
    height: '100%',
  },
  content: {
    space: 'md',
    alignItems: 'center',
  },
  iconContainer: {
    width: "$8",
    height: "$8",
    borderRadius: '$lg',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    space: 'xs',
  },
  valueText: {
    fontSize: '$2xl',
    fontWeight: '$bold',
    color: '$textPrimary',
  },
} as const;

