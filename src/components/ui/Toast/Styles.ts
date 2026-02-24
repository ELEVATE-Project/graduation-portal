export const successToastStyles = {
  toast: {
    bg: '$white',
    borderRadius: '$lg',
    marginBottom: '$4',
    marginRight: '$4',
    borderWidth: 1,
    borderColor: '$borderLight200',
    shadowColor: '$backgroundLight900',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    space: 'sm' as const,
    alignItems: 'center' as const,
    padding: '$3',
    paddingHorizontal: '$4',
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: '$full',
    bg: '$primary500',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  iconSize: 14,
  title: {
    color: '$textPrimary',
    fontSize: '$sm',
    fontWeight: '$medium',
  },
};

