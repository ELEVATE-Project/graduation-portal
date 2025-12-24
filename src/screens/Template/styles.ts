export const templateStyles = {
  iconContainer: {
    $md: {
      width: '$12',
      height: '$12',
      mr: '$4',
    },
  },
  pressableCard: {
    mb: '$4',
    mt: '$6',
    p: '$3',
    bg: '$white',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: '$2xl',
    _pressed: { opacity: 0.8 },
    $web: {
      boxShadow: '$primary500',
      outline: 'none',
      transform: 'none',
      width: '$full',
      cursor: 'pointer',
      ':hover': {
        borderColor: '$primary500',
      },
    },
  },
  iconBox: {
    width: '$10',
    height: '$10',
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
    borderTopWidth: '$px',
    borderTopColor: '$borderLight200',
    mt: '$2',
  },
  modalHeaderIcon: {
    width: '$10',
    height: '$10',
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
      width: '$full',
      justifyContent: 'center',
      gap: '$3',
    },
  },
  summaryBox: {
    bg: '$progressBarBackground',
    padding: '$3',
    borderRadius: '$md',
    borderWidth: '$px',
    borderColor: '$progressBarFillColor',
    mt: '$3',
  },
};

export default templateStyles;
