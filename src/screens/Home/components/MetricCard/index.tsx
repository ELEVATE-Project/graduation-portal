import React from 'react';
import { Box, VStack, HStack, Text, Card } from '@ui';
import { LucideIcon } from '@ui';
import { metricCardStyles } from './Styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  iconColor = '$primary500',
}) => {
  const resolveThemeColor = (value?: string) => {
    if (!value) return undefined;
    if (value.startsWith('$')) {
      const key = value.slice(1);
      return (theme.tokens.colors as any)?.[key] as string | undefined;
    }
    return value;
  };

  const toRgba = (color: string, alpha: number) => {
    // Hex: #RRGGBB
    if (/^#([0-9a-fA-F]{6})$/.test(color)) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // Hex short: #RGB
    if (/^#([0-9a-fA-F]{3})$/.test(color)) {
      const r = parseInt(color[1] + color[1], 16);
      const g = parseInt(color[2] + color[2], 16);
      const b = parseInt(color[3] + color[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // Already rgb/rgba/etc -> best effort
    return color;
  };

  const resolvedIconColor = resolveThemeColor(iconColor) || (theme.tokens.colors.primary500 as string);
  const iconBg = toRgba(resolvedIconColor, 0.12);

  return (
    <Card {...metricCardStyles.container} variant="elevated">
      <HStack {...metricCardStyles.content}>
        {icon && (
          <Box {...metricCardStyles.iconContainer} bg={iconBg as any}>
            <LucideIcon name={icon} size={20} color={resolvedIconColor} />
          </Box>
        )}
        <VStack {...metricCardStyles.textContainer}>
          <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
            {title}
          </Text>
          <Text {...metricCardStyles.valueText}>{value}</Text>
        </VStack>
      </HStack>
    </Card>
  );
};

export default MetricCard;

