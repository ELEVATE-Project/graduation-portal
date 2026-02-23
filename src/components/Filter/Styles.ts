export const filterStyles = {
  container: {
    mt: '$5' as const,
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: '$xl' as const,
    p: '$6' as const,
    width: '$full' as const,
  },
  titleContainer: {
    mb: '$4' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  titleText: {
    fontSize: '$sm' as const,
    fontWeight: '$normal' as const,
    ml: '$2' as const,
    color: '$foreground',
  },
  filterFieldsContainer: {
    gap: '$2' as const,
    flexWrap: 'wrap' as const,
    flexDirection: 'column' as const,
    $md: {
      flexDirection: 'row' as const,
    },
    justifyContent: 'space-between' as const,
  },
  roleContainer: {
    flex: 1,
    minWidth: '100%' as const,
    $md: {
      minWidth: 240,
     // maxWidth: 240,
    },
  },
  input: {
    variant: 'outline' as const,
    size: 'md' as const,
    borderRadius: '$md' as const,
    bg: '$backgroundLight50' as const,
    borderColor: '$borderLight300' as const,
    height: '$9' as const,
  },
  clearLinkText: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
    fontWeight: '$medium' as const,
    textDecorationLine: 'none' as const,
  },
}

