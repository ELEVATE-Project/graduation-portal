import React from 'react';
import type { LucideProps } from 'lucide-react-native';
import { Box } from '@ui';

/**
 * Platform-agnostic Lucide Icon wrapper
 * Automatically uses lucide-react for web and lucide-react-native for native platforms
 */

// Type definition for icon component props
export interface LucideIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * LucideIcon Component
 * A cross-platform wrapper for Lucide icons
 *
 * @param name - The name of the icon (e.g., 'Search', 'Home', 'User')
 * @param size - Icon size in pixels (default: 24)
 * @param color - Icon color (default: 'currentColor')
 * @param strokeWidth - Stroke width (default: 2)
 *
 * @example
 * ```tsx
 * <LucideIcon name="Search" size={20} color="#000" />
 * ```
 */
const LucideIcon: React.FC<LucideIconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}) => {
  // Use lucide-react-native for native platforms
  const LucideNative = require('lucide-react-native');
  const IconComponent = LucideNative[name];

  if (!IconComponent) {
    console.warn(`Lucide icon "${name}" not found`);
    return null;
  }

  return (
    <Box style={{ color: color } as any}>
      <IconComponent
        size={size}
        strokeWidth={strokeWidth}
        {...props}
      />
    </Box>
  );
};

export default LucideIcon;
