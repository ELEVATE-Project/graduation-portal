
// Keep only styles that CANNOT be done inline
// - Platform-specific ($md, $web)
// - Pseudo-states (hover)
// - Web-specific properties (boxShadow, scrollbarGutter, etc.)

export const templateStyles = {

  cardHover: {
    borderColor: '$hoverBorder',
  },
  iconContainer: {
    $md: {
      width: 48,
      height: 48,
      mr: '$4',
    },
  },
  cardWrapper: {
    $md: {
      maxWidth: 1400,
      width: '95%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    $web: {
      boxSizing: 'border-box',
    },
  },
  pressableCard: {
    mb: '$4',
    mt: '$6',
    p: '$3',
    bg: '$white',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 20,
    _pressed: { opacity: 0.8 },
    $web: {
      boxShadow: '$primary500',
      outline: 'none',
      transform: 'none',
      width: '100%',
      cursor: 'pointer',
      ':hover': {
        borderColor: '$primary500',
      },
    },
  },
  cardContent: {
    bg: '$white',
    borderRadius: 16,
    p: '$3',
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: '$md',
    bg: '$iconBgCyan',
    justifyContent: 'center',
    alignItems: 'center',
    mr: '$3',
  },
  badge: {
    borderRadius: '$sm',
    px: '$2',
    py: '$1',
    mr: '$2',
  },
  pillarsSection: {
    pt: '$4',
    borderTopWidth: 1,
    borderTopColor: '$borderLight200',
    mt: '$2',
  },
  modalHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: '$full',
    bg: '$iconBackground',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    bg: '$bgSecondary',
  },
  mainContent: {
    flex: 1,
    px: '$2',
    py: '$2',
  },
  modalFooter: {
    flexDirection: 'column-reverse',
    sx: {
      '@md': {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      width: '100%',
      justifyContent: 'center',
      gap: '$3',
    },
  },
  summaryBox: {
    bg: '$progressBarBackground',
    padding: '$3',
    borderRadius: '$md',
    borderWidth: 1,
    borderColor: '$progressBarFillColor',
    mt: '$3',
  },
  formVStack: {
    gap: '$1',
    mb: '$2',
  },
};

export default templateStyles;

