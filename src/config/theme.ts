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
      warning500: '#fe9a00',
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
      // Task Card colors for nested project children
      taskCardBg: '#f8f9fa',
      taskCardBorder: '#e9ecef',
      // Project Player semantic colors
      observationTaskBg: '#FFFBEB',        // Warm yellow background for observation tasks
      observationTaskBorder: '#F59E0B',    // Amber border for observation tasks
      addedToPlanBg: '#DCFCE7',            // Light green for "added to plan" tasks
      addedToPlanBorder: '#BBF7D0',        // Green border for "added to plan" tasks
      optionalBadgeBg: '#DBEAFE',          // Light blue background for optional badge
      optionalBadgeText: '#1e40af',        // Dark blue text for optional badge
      socialProtectionBg: '#FFF5F5',       // Light red background for Social Protection pillar
      hoverPink: '#fef2f2',                // Light pink hover background
      warningIconColor: '#ca8a04',         // Amber/yellow warning icon color
      infoIconColor: '#0284c7',            // Blue info icon color
      stylesCardBg: '#F6F7FB',             // Card background from Styles.ts
      // Pillar icon colors
      pillarSocialEmpowerment: '#9333ea',  // Purple for Social Empowerment
      pillarLivelihoods: '#15803d',        // Green for Livelihoods
      pillarFinancialInclusion: '#1d4ed8', // Blue for Financial Inclusion
      pillarSocialProtection: '#f97316',   // Orange for Social Protection
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