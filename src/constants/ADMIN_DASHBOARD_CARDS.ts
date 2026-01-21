/**
 * Admin Dashboard Cards Constants
 * Defines the indicator cards data for the admin dashboard
 */

export interface DashboardCard {
  id: string;
  icon?: string;
  iconColor?: string;
  title: string; // Translation key
  description: string; // Translation key
  navigationUrl?: string;
  status?: {
    type: string;
    label: string; // Translation key
  };
}

// Indicator cards data
export const indicatorCards: DashboardCard[] = [
  {
    id: 'output-indicators',
    icon: 'TrendingUp',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.title',
    description: 'admin.outputIndicators.description',
    navigationUrl: '/output-indicators',
    status: {
      type: 'not-started',
      label: 'admin.outputIndicators.topics',
    },
  },
  {
    id: 'outcome-indicators',
    icon: 'Target',
    iconColor: '$bgPrimary/10',
    title: 'admin.outcomeIndicators.title',
    description: 'admin.outcomeIndicators.description',
    navigationUrl: '/outcome-indicators',
    status: {
      type: 'not-started',
      label: 'admin.outcomeIndicators.topics',
    },
  },
];
