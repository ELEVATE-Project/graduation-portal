import { Platform } from 'react-native';

export const calendarStyles = {
  container: {
    bg: '$white' as const,
    borderRadius: '$lg' as const,
    borderWidth: 1,
    borderColor: '$borderLight200' as const,
    p: '$3' as const,
    maxWidth: 250,
    shadowColor: '$foreground' as const,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContainer: {
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    mb: '$3' as const,
  },
  monthYearText: {
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
    color: '$textForeground' as const,
  },
  monthYearContainer: {
    alignItems: 'center' as const,
    space: 'xs' as const,
  },
  yearNavigationContainer: {
    space: 'xs' as const,
  },
  dayHeaderContainer: {
    justifyContent: 'space-around' as const,
    my: '$2' as const,
  },
  dayHeaderBox: {
    width: 32,
    alignItems: 'center' as const,
  },
  dayHeaderText: {
    fontSize: '$xs' as const,
    fontWeight: '$medium' as const,
    color: '$textMutedForeground' as const,
  },
  calendarGrid: {
    space: 'xs' as const,
  },
  calendarRow: {
    justifyContent: 'space-around' as const,
  },
  dateCell: {
    width: 32,
    height: 32,
    borderRadius: '$md' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  dateText: {
    fontSize: '$sm' as const,
  },
  footerContainer: {
    justifyContent: 'space-between' as const,
    mt: '$3' as const,
    pt: '$3' as const,
    borderTopWidth: 1,
    borderColor: '$borderLight200' as const,
  },
  footerButtonText: {
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
    color: '$primary500' as const,
  },
};

// Helper functions for dynamic styles
export const getDateCellStyle = (
  isSelectedDay: boolean,
  isTodayDay: boolean,
  isCurrentMonth: boolean,
  isDisabledDay: boolean
) => {
  return {
    bg: isSelectedDay
      ? '$primary500'
      : isTodayDay
      ? '$primary100'
      : 'transparent',
    borderWidth: isSelectedDay ? 2 : 0,
    borderColor: isSelectedDay ? '$primary700' : 'transparent',
    opacity: !isCurrentMonth || isDisabledDay ? 0.3 : 1,
  };
};

export const getDateTextStyle = (
  isSelectedDay: boolean,
  isTodayDay: boolean
) => {
  return {
    fontWeight: isSelectedDay ? ('$semibold' as const) : ('$normal' as const),
    color: isSelectedDay
      ? '$white'
      : isTodayDay
      ? '$primary600'
      : '$textForeground',
  };
};

export const datePickerStyles = {
  containerBox: {
    position: 'relative' as const,
  },
  inputContainer: {
    position: 'relative' as const,
  },
  inputHStack: {
    alignItems: 'center' as const,
    space: 'sm' as const,
    px: '$3' as const,
    width: '$full' as const,
  },
  getCalendarContentStyle: (platform: string, calendarPosition: { top: number; left: number }) => {
    const baseStyle: any = {
      position: 'absolute' as const,
    };

    if (platform !== 'web') {
      baseStyle.top = '100%';
      baseStyle.left = '$0';
      baseStyle.mt = '$2';
    }

    const platformStyles = [
      platform === 'web' && {
        position: 'fixed' as any,
        top: calendarPosition.top,
        left: calendarPosition.left,
        zIndex: 99999,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      },
      platform === 'android' && {
        zIndex: 99999,
        elevation: 10,
      },
      platform === 'ios' && {
        zIndex: 99999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    ].filter(Boolean);

    return {
      ...baseStyle,
      style: platformStyles as any,
    };
  },
  getContainerBoxStyle: (platform: string) => {
    return platform === 'web' ? { overflow: 'visible' as const } : {};
  },
};
