// Keep only styles that CANNOT be done inline
// - Platform-specific ($md, $web)
// - Pseudo-states (hover)
// - Web-specific properties (boxShadow, scrollbarGutter, etc.)

export const idpStyles = {
  scrollView: {
    $md: {
      padding: '$6',
    },
    $web: {
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
      scrollbarGutter: 'stable',
    },
  },
  container: {
    $md: {
      px: '$4',
      py: '$4',
    },
  },
  card: {
    $md: {
      p: '$8',
      mb: '$6',
    },
    $web: {
      boxShadow: '0 1px 4px rgba(16,24,40,0.04)',
    },
  },
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
    _pressed: { opacity: 0.8 },
    $web: {
      outline: 'none',
      transform: 'none',
      width: '100%',
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
};

export default idpStyles;

