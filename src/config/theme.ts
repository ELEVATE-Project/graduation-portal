import { config as gluestackConfig } from '@gluestack-ui/config';
export const theme = {
  ...gluestackConfig,
  tokens: {
    ...gluestackConfig.tokens,
    colors: {
      ...gluestackConfig.tokens.colors,
      primary500: '#8B2842',
      primary600: '#A53E54',
      primary700: '#6B1E31',
      primary100: '#fef2f2',
      info100: '#0ea5e9',
      accent100: '#F1F5F94D',
      accent200: '#10B981',
      accent300: '#22c55e',
      accent400: '#9810fa',
      backgroundPrimary: {
        light: '#ffffff',
        dark: '#1a1a1a',
      },
      foreground: 'oklch(0.145 0 0)',
      mutedForeground: '#717182',
      mutedBorder: '#e0e0e0',
      error: {
        light: '#dc2626',
        dark: '#f87171',
      },
      // Modal & UI colors
      modalBorder: '#8B2842',
      modalBackground: '#FFFFFF',
      modalBackdrop: 'rgba(0, 0, 0, 0.5)',
      inputBorder: '#E5E7EB',
      inputFocusBorder: '#8B2842',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      iconBackground: 'rgba(139, 40, 66, 0.08)',
      hoverBackground: '#F9FAFB',
      textMutedForeground: '#64748b',
      textForeground: '#2d2d2d',
      textForegroundColor: '#1e293b',
      bgSidebar: '#f8fafc',
      btnPrimary: '#8B2842',
      progressBarBackground: '#dbeafe',
      progressBarFillColor: '#2b7fff',
      success600: '#00a63e',
      error50: '#fef2f2',
      error200: '#ffc9c9',
      error600: '#dc2626',
      error700: '#7f1d1d',
      error900: '#82181a',
      bgDestructive: '#ef4444',
      // Background colors
      bgSecondary: '#f0f2f5',
      // Hover states
      hoverBorder: '#C593A0',
      // Icon colors - Cyan/Teal variants
      iconBgCyan: '#e0f7fa',
      iconCyan: '#00bcd4',
      // Badge colors
      badgeSuccessBg: '#e6ffe6',
      badgeSuccessText: '#00b300',
      badgeInfoBg: '#eaf3ff',
      badgeInfoText: '#0b67e6',

      // Task Card colors for nested project children
      taskCardBg: '#f8f9fa',
      taskCardBorder: '#e9ecef',
    },
    sizes: {
      ...((gluestackConfig.tokens as any).sizes || {}),
      container: {
        0: '100%',     // mobile
        sm: '540px',   // bootstrap container sm
        md: '720px',
        lg: '960px',
        xl: '1280px',
        '2xl': '1320px',
      },
    },
  },
  components: {
    ...gluestackConfig.components,
    Button: {
      ...gluestackConfig.components.Button,
    },
  },
} as const;