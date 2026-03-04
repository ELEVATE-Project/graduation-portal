import React, { useMemo, useState } from 'react';
import { VStack, HStack, ScrollView, Box } from '@ui';
import Container from '@ui/Container';

import { dashboardStyles } from './Styles';
import MetricCard from './components/MetricCard';
import TasksOverviewCard from './components/TasksOverviewCard';
import EnrollmentStatusCard from './components/EnrollmentStatusCard';
import TopPerformersCard from './components/TopPerformersCard';
import NeedsAttentionCard from './components/NeedsAttentionCard';
import TitleHeader from '@components/TitleHeader';
import FilterButton from '@components/Filter';
import { TabButton } from '@components/Tabs';
import type { TabData } from '@app-types/components';
import { LcDashboardFilterOptions } from '@constants/LC_DASHBOARD_FILTERS';
import IndividualOutcomeIndicators from './components/IndividualOutcomeIndicators';

/**
 * DashboardScreen - Layout is automatically applied by navigation based on user role
 */
const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'outcomeIndicators'>(
    'overview',
  );
  const [filters, setFilters] = useState<Record<string, any>>({});

  const tabs: TabData[] = useMemo(
    () => [
      { key: 'overview', label: 'Overview' },
      { key: 'outcomeIndicators', label: 'admin.outcomeIndicators.title' },
    ],
    [],
  );

  return (
    <ScrollView {...dashboardStyles.scrollView}>
      <Container>
        <VStack {...dashboardStyles.mainVStack}>
          {/* Title */}
          <TitleHeader title="admin.dashboard" description="admin.dashboardDescription" />

          {/* Filters (same component used on Admin Dashboard) */}
          <FilterButton
            data={LcDashboardFilterOptions as any[]}
            onFilterChange={setFilters}
          />

          {/* Tabs (segmented control style - matches existing app UI) */}
          <HStack
            width="$full"
            maxWidth={420}
            bg="$backgroundLight50"
            borderRadius={50}
            p={4}
            gap={4}
            alignItems="center"
            alignSelf="flex-start"
          >
            {tabs.map(tab => (
              <TabButton
                key={tab.key}
                tab={tab}
                isActive={activeTab === (tab.key as any)}
                onPress={(key) => setActiveTab(key as any)}
                variant="ButtonTab"
              />
            ))}
          </HStack>

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <VStack {...dashboardStyles.contentContainer}>
              {/* Metric Cards Row */}
              <HStack {...dashboardStyles.metricsRow}>
                <Box {...dashboardStyles.metricColumn}>
                  <MetricCard title="Total Caseload" value={36} icon="Users" iconColor="$primary500" />
                </Box>
                <Box {...dashboardStyles.metricColumn}>
                  <MetricCard title="Active Participants" value={17} icon="Activity" iconColor="$info100" />
                </Box>
                <Box {...dashboardStyles.metricColumn}>
                  <MetricCard title="Completed" value={7} icon="CircleCheck" iconColor="$success600" />
                </Box>
                <Box {...dashboardStyles.metricColumn}>
                  <MetricCard title="Average Progress" value="65%" icon="Clock" iconColor="$blue500" />
                </Box>
              </HStack>

              {/* Cards Grid */}
              <HStack {...dashboardStyles.cardsRow}>
                <Box {...dashboardStyles.cardColumn}>
                  <TasksOverviewCard />
                </Box>
                <Box {...dashboardStyles.cardColumn}>
                  <EnrollmentStatusCard />
                </Box>
              </HStack>

              <HStack {...dashboardStyles.cardsRow}>
                <Box {...dashboardStyles.cardColumn}>
                  <TopPerformersCard />
                </Box>
                <Box {...dashboardStyles.cardColumn}>
                  <NeedsAttentionCard />
                </Box>
              </HStack>
            </VStack>
          )}

          {/* Outcome Indicators Tab Content */}
          {activeTab === 'outcomeIndicators' && (
            <IndividualOutcomeIndicators />
          )}
        </VStack>
      </Container>
    </ScrollView>
  );
};

export default DashboardScreen;
