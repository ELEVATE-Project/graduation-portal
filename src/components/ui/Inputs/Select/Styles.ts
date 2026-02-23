/**
 * Select Component Styles
 */
export const getSelectTriggerStyles: (
  bg?: string,
  borderColor?: string,
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  borderRadius?: string
) => any = (
  bg?: string,
  borderColor?: string,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md',
  borderRadius: string = '$xl'
) => {
  return {
    variant: 'outline' as const,
    size: size as const,
    borderRadius: borderRadius as const,
    width: '$full' as const,
    bg,
    backgroundColor: bg,
    borderColor,
    '$focus-borderColor': borderColor || 'transparent',
    '$focus-borderWidth': 0 as const,
    shadowColor: 'transparent' as const,
    shadowOpacity: 0 as const,
    fontSize: '$sm' as const,
    lineHeight: '$sm' as const,
    '$web-style': {
      boxShadow: 'none' as const,
    },
  } as any;
};

