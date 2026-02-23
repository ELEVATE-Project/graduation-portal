export const titleHeaderStyles = {
  textContainer: {},
  titleText: {
    fontSize: '$2xl',
    fontWeight: '$medium',
    lineHeight: 36,
    mb: '$2',
    color: '$textForeground',
  },
  descriptionText: {
    color: '$textMutedForeground',
    fontSize: '$md',
    lineHeight: '$md',
    fontWeight: '$normal',
  },
  // Button styles for right-side action buttons
  outlineButton: {
    bg: '$white',
    borderWidth: 1,
    borderColor: '$borderLight300',
    borderRadius: '$md',
    px: '$3',
    py: '$2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: '$sm',
    color: '$textForeground',
    fontWeight: '$medium',
  },
  solidButton: {
    bg: '$btnPrimary',
    borderRadius: '$md',
    px: '$3',
    py: '$2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  solidButtonText: {
    fontSize: '$sm',
    color: '$white',
    fontWeight: '$medium',
  },
} as const;

