import { Platform } from 'react-native';

/**
 * Font utility for loading and using Poppins font across platforms
 * For React Native: Fonts should be added to assets/fonts/ directory
 * For Web: Fonts are loaded via Google Fonts in index.html
 */

export const FONT_FAMILY = {
  POPPINS: Platform.select({
    ios: 'Poppins',
    android: 'Poppins',
    web: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    default: 'Poppins',
  }),
} as const;

/**
 * Get the default font family for the current platform
 */
export const getDefaultFontFamily = (): string => {
  return FONT_FAMILY.POPPINS || 'System';
};

