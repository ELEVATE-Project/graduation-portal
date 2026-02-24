import React, { useState } from 'react';
import { VStack, Heading, Box, Card, Text, HStack } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { TabButton } from '@components/Tabs';
import StatCard, { StatsRow } from '@components/StatCard';
import { TabData } from '@app-types/components';
import { cardViewStyles } from './CardViewStyles';

interface MetricCardData {
  id: string;
  title: string; // Translation key
  value: string | number;
  subtitle: string; // Translation key
  count?: string; // Optional count to show before subtitle
  baseValue?: string; // Base value for percentage calculation (e.g., assigned count)
}

interface CardViewProps {
  tabs: TabData[];
  metricCards: MetricCardData[];
  insightsTitle?: string; // Translation key
  insightsItems?: string[]; // Translation keys
}

/**
 * CardView Component
 * Displays indicator details with tabs, metric cards, and insights
 * Used within DashboardCards to show card details on the same screen
 */
const CardView: React.FC<CardViewProps> = ({
  tabs,
  metricCards,
  insightsTitle,
  insightsItems,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.key || '');

  return (
    <VStack {...cardViewStyles.container}>
      {/* Tabs */}
      <Box mt="$4" mb="$6">
        <HStack
          bg="$backgroundLight50"
          borderRadius={50}
          p={4}
          gap={4}
          alignItems="center"
          alignSelf="flex-start"
        >
          {tabs.map(tab => (
            <Box 
              key={tab.key}
              flexShrink={0}
              style={{ 
                flex: 0,
                minWidth: 'auto',
                width: 'auto',
              } as any}
            >
              <TabButton
                tab={tab}
                isActive={activeTab === tab.key}
                onPress={setActiveTab}
                variant="ButtonTab"
              />
            </Box>
          ))}
        </HStack>
      </Box>

      {/* Content based on active tab */}
      {activeTab === 'snapshot' && (
        <VStack space="md">
          {/* Metric Cards */}
          <StatsRow>
            {metricCards.map(metric => {
              // Calculate percentage if baseValue is provided
              let displayValue: string | number = metric.value;
              if (metric.baseValue && metric.count) {
                const baseNum = parseFloat(metric.baseValue.replace(/,/g, ''));
                const countNum = parseFloat(metric.count.replace(/,/g, ''));
                if (!isNaN(baseNum) && !isNaN(countNum) && baseNum > 0) {
                  const percentage = Math.round((countNum / baseNum) * 100);
                  displayValue = `${percentage}%`;
                }
              }

              return (
                <StatCard
                  key={metric.id}
                  title={metric.title}
                  count={displayValue}
                  subLabel={metric.subtitle}
                  showCountBeforeSubLabel={!!metric.count}
                  countValue={metric.count}
                />
              );
            })}
          </StatsRow>

          {/* Key Insights */}
          {insightsTitle && insightsItems && (
            <Card {...cardViewStyles.insightsCard}>
              <Heading {...cardViewStyles.insightsTitle}>
                {t(insightsTitle)}
              </Heading>
              <VStack space="sm" mt="$4">
                {insightsItems.map((item, index) => (
                  <Text key={index} {...cardViewStyles.insightItem}>
                    • {t(item)}
                  </Text>
                ))}
              </VStack>
            </Card>
          )}
        </VStack>
      )}

      {activeTab === 'graphs' && (
        <Box {...cardViewStyles.graphsContainer}>
          <Text>{t('admin.participantEnrollment.graphs.placeholder')}</Text>
        </Box>
      )}
    </VStack>
  );
};

export default CardView;
