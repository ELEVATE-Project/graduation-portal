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

/**
 * Select Content/Dropdown Styles
 */
export const selectContentStyles = {
  borderRadius: '$xl',
  padding: '$2',
  maxHeight: 320,
  minWidth: 260,
  shadowColor: 'rgba(2,6,23,0.08)',
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },
  elevation: 24,
  bg: '$modalBackground',
} as const;
