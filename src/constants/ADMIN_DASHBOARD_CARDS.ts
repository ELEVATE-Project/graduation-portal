/**
 * Admin Dashboard Cards Constants
 * Defines the indicator cards data for the admin dashboard
 */

import { TabData } from '@app-types/components';

export interface DashboardCard {
  id: string;
  icon?: string;
  iconColor?: string;
  title: string; // Translation key
  description: string; // Translation key
  navigationUrl?: string;
  subCards?: DashboardCard[]; // Sub-cards for hierarchical navigation
  status?: {
    type: string;
    label: string; // Translation key
  };
}

export interface MetricCardData {
  id: string;
  title: string; // Translation key
  value: string | number; // Display value (count or percentage)
  subtitle: string; // Translation key
  count?: string; // Optional count to show before subtitle
  baseValue?: string; // Base value for percentage calculation (e.g., assigned count)
}

export interface CardViewData {
  tabs: TabData[];
  metricCards: MetricCardData[];
  insightsTitle?: string; // Translation key
  insightsItems?: string[]; // Translation keys
}

// Output Indicator Topic Cards
export const outputIndicatorTopicCards: DashboardCard[] = [
  {
    id: 'participant-enrollment',
    icon: 'Users',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.topics.participantEnrollment.title',
    description: 'admin.outputIndicators.topics.participantEnrollment.description',
  },
  {
    id: 'social-protection-referrals',
    icon: 'UserCheck',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.topics.socialProtectionReferrals.title',
    description: 'admin.outputIndicators.topics.socialProtectionReferrals.description',
  },
  {
    id: 'social-empowerment',
    icon: 'Heart',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.topics.socialEmpowerment.title',
    description: 'admin.outputIndicators.topics.socialEmpowerment.description',
  },
  {
    id: 'big-push',
    icon: 'TrendingUp',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.topics.bigPush.title',
    description: 'admin.outputIndicators.topics.bigPush.description',
  },
  {
    id: 'livelihood-promotion',
    icon: 'Briefcase',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.topics.livelihoodPromotion.title',
    description: 'admin.outputIndicators.topics.livelihoodPromotion.description',
  },
  {
    id: 'financial-inclusion',
    icon: 'DollarSign',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.topics.financialInclusion.title',
    description: 'admin.outputIndicators.topics.financialInclusion.description',
  },
  {
    id: 'coaching',
    icon: 'GraduationCap',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.topics.coaching.title',
    description: 'admin.outputIndicators.topics.coaching.description',
  },
  {
    id: 'drop-outs',
    icon: 'TrendingDown',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.topics.dropOuts.title',
    description: 'admin.outputIndicators.topics.dropOuts.description',
  },
];

// Outcome Indicator Type Cards
export const outcomeIndicatorTypeCards: DashboardCard[] = [
  {
    id: 'cumulative-indicators',
    icon: 'BarChart',
    iconColor: '$bgPrimary/10',
    title: 'admin.outcomeIndicators.types.cumulative.title',
    description: 'admin.outcomeIndicators.types.cumulative.description',
    status: {
      type: 'not-started',
      label: 'admin.outcomeIndicators.types.cumulative.topics',
    },
  },
  {
    id: 'individual-indicators',
    icon: 'Users',
    iconColor: '$bgPrimary/10',
    title: 'admin.outcomeIndicators.types.individual.title',
    description: 'admin.outcomeIndicators.types.individual.description',
    status: {
      type: 'not-started',
      label: 'admin.outcomeIndicators.types.individual.topics',
    },
  },
];

// Indicator cards data
export const indicatorCards: DashboardCard[] = [
  {
    id: 'output-indicators',
    icon: 'TrendingUp',
    iconColor: '$bgPrimary/10',
    title: 'admin.outputIndicators.title',
    description: 'admin.outputIndicators.description',
    navigationUrl: '/output-indicators',
    subCards: outputIndicatorTopicCards, // Add sub-cards
    status: {
      type: 'not-started',
      label: 'admin.outputIndicators.topicsCount',
    },
  },
  {
    id: 'outcome-indicators',
    icon: 'Target',
    iconColor: '$bgPrimary/10',
    title: 'admin.outcomeIndicators.title',
    description: 'admin.outcomeIndicators.description',
    navigationUrl: '/outcome-indicators',
    subCards: outcomeIndicatorTypeCards, // Add sub-cards
    status: {
      type: 'not-started',
      label: 'admin.outcomeIndicators.topics',
    },
  },
];

// Card View Data - Maps card IDs to their CardView configuration
export const cardViewDataMap: Record<string, CardViewData> = {
  'participant-enrollment': {
    tabs: [
      {
        key: 'snapshot',
        label: 'admin.participantEnrollment.tabs.snapshot',
        icon: 'BarChart',
      },
      {
        key: 'graphs',
        label: 'admin.participantEnrollment.tabs.graphs',
        icon: 'TrendingUp',
      },
    ],
    metricCards: [
      {
        id: 'assigned',
        title: 'admin.participantEnrollment.metrics.assigned.title',
        value: '2,718', // Base value for percentage calculations
        subtitle: 'admin.participantEnrollment.metrics.assigned.subtitle',
        count: undefined, // No count for assigned (it's the base)
      },
      {
        id: 'contacted',
        title: 'admin.participantEnrollment.metrics.contacted.title',
        value: '2,456', // Count value
        subtitle: 'admin.participantEnrollment.metrics.contacted.subtitle',
        count: '2,456', // Count to display in subtitle
        baseValue: '2,718', // Base value for percentage calculation
      },
      {
        id: 'consent',
        title: 'admin.participantEnrollment.metrics.consent.title',
        value: '2,609', // Count value
        subtitle: 'admin.participantEnrollment.metrics.consent.subtitle',
        count: '2,609', // Count to display in subtitle
        baseValue: '2,718', // Base value for percentage calculation
      },
      {
        id: 'sla',
        title: 'admin.participantEnrollment.metrics.sla.title',
        value: '2,609', // Count value
        subtitle: 'admin.participantEnrollment.metrics.sla.subtitle',
        count: '2,609', // Count to display in subtitle
        baseValue: '2,718', // Base value for percentage calculation
      },
    ],
    insightsTitle: 'admin.participantEnrollment.insights.title',
    insightsItems: [
      'admin.participantEnrollment.insights.assigned',
      'admin.participantEnrollment.insights.contacted',
      'admin.participantEnrollment.insights.consent',
      'admin.participantEnrollment.insights.sla',
    ],
  },
};
