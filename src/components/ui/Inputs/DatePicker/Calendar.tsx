import React, { useState, useMemo } from 'react';
import { Pressable } from 'react-native';
import { Box, Text, HStack, VStack } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { calendarStyles, getDateCellStyle, getDateTextStyle } from './Styles';

interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  maximumDate?: Date;
  minimumDate?: Date;
  calendarId?: string; // Unique ID for this calendar instance
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  onClose,
  maximumDate = new Date(),
  minimumDate,
  calendarId,
}) => {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(value.getFullYear(), value.getMonth(), 1)
  );

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getDaysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // Add days from next month to fill the grid (6 rows × 7 days = 42)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setFullYear(prev.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    onChange(date);
  };

  const handleToday = () => {
    const today = new Date();
    if (!isDateDisabled(today)) {
      onChange(today);
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  };

  const handleClear = () => {
    onClose();
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (maximumDate && date > maximumDate) return true;
    if (minimumDate && date < minimumDate) return true;
    return false;
  };

  const monthYear = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
    <Box 
      {...calendarStyles.container} 
      data-calendar-container={calendarId || undefined}
    >
      {/* Header with Month/Year Navigation */}
      <HStack {...calendarStyles.headerContainer}>
        <Pressable onPress={() => navigateMonth('prev')}>
          <LucideIcon name="ChevronLeft" size={20} color="$textForeground" />
        </Pressable>
        
        <Pressable onPress={() => {}}>
          <HStack {...calendarStyles.monthYearContainer}>
            <Text {...calendarStyles.monthYearText}>
              {monthYear}
            </Text>
            <LucideIcon name="ChevronDown" size={16} color="$textMutedForeground" />
          </HStack>
        </Pressable>
        
        <HStack {...calendarStyles.yearNavigationContainer}>
          <Pressable onPress={() => navigateYear('prev')}>
            <LucideIcon name="ChevronUp" size={16} color="$textForeground" />
          </Pressable>
          <Pressable onPress={() => navigateYear('next')}>
            <LucideIcon name="ChevronDown" size={16} color="$textForeground" />
          </Pressable>
        </HStack>
      </HStack>

      {/* Day names header */}
      <HStack {...calendarStyles.dayHeaderContainer}>
        {dayNames.map((day, index) => (
          <Box key={index} {...calendarStyles.dayHeaderBox}>
            <Text {...calendarStyles.dayHeaderText}>
              {day}
            </Text>
          </Box>
        ))}
      </HStack>

      {/* Calendar grid */}
      <VStack {...calendarStyles.calendarGrid}>
        {[0, 1, 2, 3, 4, 5].map(row => (
          <HStack key={row} {...calendarStyles.calendarRow}>
            {getDaysInMonth.slice(row * 7, (row + 1) * 7).map((day, index) => {
              const isSelectedDay = isSelected(day.date);
              const isTodayDay = isToday(day.date);
              const isDisabledDay = isDateDisabled(day.date);

              return (
                <Pressable
                  key={index}
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    handleDateSelect(day.date);
                  }}
                  disabled={isDisabledDay}
                >
                  <Box
                    {...calendarStyles.dateCell}
                    {...getDateCellStyle(isSelectedDay, isTodayDay, day.isCurrentMonth, isDisabledDay)}
                  >
                    <Text
                      {...calendarStyles.dateText}
                      {...getDateTextStyle(isSelectedDay, isTodayDay)}
                    >
                      {day.date.getDate()}
                    </Text>
                  </Box>
                </Pressable>
              );
            })}
          </HStack>
        ))}
      </VStack>

      {/* Footer buttons */}
      <HStack {...calendarStyles.footerContainer}>
        <Pressable onPress={handleClear}>
          <Text {...calendarStyles.footerButtonText}>
            {t('common.clear')}
          </Text>
        </Pressable>
        <Pressable onPress={handleToday}>
          <Text {...calendarStyles.footerButtonText}>
            Today
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
};

export default Calendar;
