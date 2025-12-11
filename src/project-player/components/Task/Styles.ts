export const taskCardStyles = {
  // File input (hidden)
  hiddenInput: {
    display: 'none' as const,
  },

  // Card style for children of project tasks
  childCard: {
    size: 'md' as const,
    variant: 'elevated' as const,
    bg: '$taskCardBg',
    borderRadius: '$lg',
    marginBottom: '$3',
    borderWidth: 1,
    borderColor: '$taskCardBorder',
  },
  childCardContent: {
    padding: '$4',
  },

  // Inline style for preview mode with project children
  previewInlineContainer: {
    alignItems: 'center' as const,
    space: 'md' as const,
    paddingVertical: '$2',
    paddingHorizontal: '$1',
  },

  // Default inline style for regular tasks
  regularTaskContainer: {
    bg: '$backgroundPrimary.light',
    padding: '$5',
  },
  statusIndicatorContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Status circle
  statusCircle: {
    borderRadius: '$full',
    borderWidth: 2,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Divider
  divider: {
    height: 1,
    bg: '$inputBorder',
  },

  // Action button styles
  actionButton: {
    size: 'sm' as const,
    variant: 'outline' as const,
    bg: '$backgroundPrimary.light',
    ml: '$3',
  },
  actionButtonCard: {
    borderColor: '$textSecondary',
    hoverBg: '$primary100' as const,
  },
  actionButtonInline: {
    borderColor: '$inputBorder',
    hoverBg: '$primary100' as const,
  },
  actionButtonText: {
    color: '$textSecondary',
  },
  actionButtonTextHover: {
    color: '$primary500' as const,
  },

  // Custom task actions (edit/delete)
  customActionsContainer: {
    space: 'xs' as const,
    ml: '$2',
  },
  editActionBox: {
    padding: '$1',
    borderRadius: '$sm',
    hoverBg: '$primary100' as const,
  },
  deleteActionBox: {
    padding: '$1',
    borderRadius: '$sm',
    hoverBg: '$error100' as const,
  },
} as const;

export const taskAccordionStyles = {
  container: {
    marginBottom: '$3',
  },
  card: {
    size: 'md' as const,
    variant: 'elevated' as const,
    bg: '$backgroundPrimary.light',
    borderRadius: '$lg',
  },
  cardHeader: {
    padding: '$5',
    borderBottomWidth: 1,
    borderBottomColor: '$mutedBorder',
  },
  cardHeaderContent: {
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  cardContent: {
    paddingHorizontal: '$5',
    paddingBottom: '$5',
  },
  cardContentStack: {
    space: 'md' as const,
    paddingTop: '$3',
  },
  taskBadge: {
    bg: '$primary100',
    paddingHorizontal: '$3',
    paddingVertical: '$1',
    borderRadius: '$full',
    borderColor: '$primary500',
  },
  accordion: {
    type: 'single' as const,
    variant: 'unfilled' as const,
    shadowColor: '$backgroundLight900',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accordionItem: {
    bg: '$backgroundPrimary.light',
    borderRadius: '$lg',
    borderWidth: 1,
    borderColor: '$mutedBorder',
  },
  accordionTrigger: {
    padding: '$5',
  },
  accordionHeaderContent: {
    flex: 1,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  accordionIconContainer: {
    ml: '$4',
  },
  accordionContent: {
    paddingHorizontal: '$5',
    paddingBottom: '$5',
  },
  accordionContentStack: {
    space: 'md' as const,
    paddingTop: '$3',
  },
} as const;

export const addCustomTaskStyles = {
  button: {
    borderRadius: '$md',
    borderWidth: 1,
    borderStyle: 'dashed' as const,
    borderColor: '$mutedBorder',
    padding: '$1',
    marginTop: '$3',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: 'pointer' as const,
    hoverBg: '$primary100',
    hoverBorderColor: '$primary500',
  },
  buttonDefaultBg: '$accent100',
  buttonHoverBg: '$primary100',
  buttonContent: {
    space: 'sm' as const,
    alignItems: 'center' as const,
  },
} as const;

export const addCustomTaskModalStyles = {
  modalBody: {
    padding: '$6',
    paddingTop: '$2',
  },
  formStack: {
    space: 'lg' as const,
  },
  fieldStack: {
    space: 'xs' as const,
  },
  input: {
    variant: 'outline' as const,
    size: 'lg' as const,
    borderWidth: 1,
    borderColor: '$inputBorder',
    borderRadius: '$md',
    bg: '$backgroundPrimary.light',
    focusBorderColor: '$primary500',
    focusBorderWidth: 2,
  },
  textarea: {
    size: 'lg' as const,
    borderWidth: 1,
    borderColor: '$inputBorder',
    borderRadius: '$md',
    bg: '$backgroundPrimary.light',
    focusBorderColor: '$primary500',
    focusBorderWidth: 2,
    minHeight: 100,
  },
  select: {
    bg: '$backgroundPrimary.light',
    borderColor: '$inputBorder',
  },
  pillarDisplayBox: {
    bg: '$mutedForeground',
    padding: '$3',
    borderRadius: '$md',
    borderWidth: 1,
    borderColor: '$inputBorder',
  },
  modalFooter: {
    borderTopWidth: 0,
    padding: '$6',
    paddingTop: '$4',
  },
  footerButtons: {
    space: 'md' as const,
    width: '$full',
    justifyContent: 'flex-end' as const,
  },
  cancelButton: {
    variant: 'outline' as const,
    borderWidth: 1,
    borderColor: '$inputBorder',
    bg: '$backgroundPrimary.light',
    paddingHorizontal: '$6',
    paddingVertical: '$3',
    borderRadius: '$md',
    hoverBg: '$hoverBackground' as const,
    cursor: 'pointer' as const,
  },
  submitButton: {
    variant: 'solid' as const,
    bg: '$primary500',
    paddingHorizontal: '$6',
    paddingVertical: '$3',
    borderRadius: '$md',
    hoverBg: '$primary500' as const,
    hoverOpacity: 0.9,
    cursor: 'pointer' as const,
  },
  submitButtonContent: {
    space: 'xs' as const,
    alignItems: 'center' as const,
  },
} as const;
