/**
 * Select Component Styles
 */
export const getSelectTriggerStyles = (bg?: string, borderColor?: string) => {
  return {
    variant: 'outline' as const,
    size: 'md' as const,
    width: '$full' as const,
    bg,
    backgroundColor: bg,
    borderColor,
    '$focus-borderColor': borderColor || 'transparent',
    '$focus-borderWidth': 0 as const,
    shadowColor: 'transparent' as const,
    shadowOpacity: 0 as const,
    '$web-style': {
      boxShadow: 'none' as const,
    },
  } as any;
};

