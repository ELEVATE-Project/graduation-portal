import React from 'react';
import { VStack, Card, Heading, Text } from '@ui';

import { adminDashboardStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import TitleHeader from '@components/TitleHeader';
import FilterButton from '@components/Filter';
import DashboardCards from './DashboardCards';
import { AdminDashboardFilterOptions } from '@constants/ADMIN_DASHBOARD_FILTERS';
import { indicatorCards } from '@constants/ADMIN_DASHBOARD_CARDS';

const AdminDashboard = () => {
  const { t } = useLanguage();

  const handleFilterChange = (filters: Record<string, any>) => {
    console.log('Dashboard filters changed:', filters);
    // Add your filter logic here
  };

  return (
    <VStack {...adminDashboardStyles.container}>
      {/* Title Header */}
      <TitleHeader title="admin.dashboard" description="admin.dashboardDescription" />

      {/* Filter Button */}
      <FilterButton 
        data={AdminDashboardFilterOptions as any[]} 
        onFilterChange={handleFilterChange}
      />

      {/* Info Card */}
      <Card {...adminDashboardStyles.infoCard}>
        <Heading {...adminDashboardStyles.infoHeading}>
          {t('admin.selectIndicatorType')}
        </Heading>
        <Text {...adminDashboardStyles.infoText}>{t('admin.indicatorTypeDescription')}</Text>
      </Card>

      {/* Indicator Cards */}
      <DashboardCards cards={indicatorCards} />
    </VStack>
  );
};

export default AdminDashboard;