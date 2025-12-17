import { theme } from '@config/theme';

export const logVisitStyles = {
  container: {
    flex: 1,
    bg: '$white',
    borderWidth: 1,
    borderColor: '$borderLight300',
    borderRadius: '$2xl',
    p: '$6',
  },
  title: {
    fontSize: '$lg',
    fontWeight: '$semibold',
    color: '$textForeground',
  },
  headerContainer: {
    bg: '$white' as const,
    padding: '$4' as const,
    '$md-paddingHorizontal': '$6' as const,
    '$md-paddingVertical': '$4' as const,
    borderBottomWidth: '$1' as const,
    borderBottomColor: '$borderLight300' as const,
  },
  headerContent: {
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    '$md-alignItems': 'flex-start' as const,
    marginHorizontal: '$0' as const,
    '$md-marginHorizontal': '$24' as const,
    '$md-paddingHorizontal': '$5' as const,
    paddingHorizontal: '$0' as const,
    gap: '$2' as const,
  },
} as const;

