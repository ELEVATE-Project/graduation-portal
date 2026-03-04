import React, { useMemo, useState } from 'react';
import { VStack, HStack, Box, Text, Card, Select, Progress, ProgressFilledTrack } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import DashboardGraphs from '../../../AdminDashboard/DashboardGraphs';
import type { DashboardGraphBlock } from '@app-types/dashboardGraphs';

const IndividualOutcomeIndicators: React.FC = () => {
  const { t } = useLanguage();
  const [selectedParticipant, setSelectedParticipant] = useState<string>('P001');

  const participantOptions = useMemo(
    () => [
      { value: 'P001', name: 'Thabiso Dlamini (ID: undefined)' },
      { value: 'P002', name: 'Nomvula Dlamini (P002)' },
      { value: 'P003', name: 'Sipho Ndlovu (P003)' },
    ],
    [],
  );

  // Combined metric cards from all individual indicators
  const metricCards = [
    {
      id: 'current-monthly-income',
      title: 'Current Monthly Income',
      value: 'R3,606',
      subtitle: '103.3% from baseline',
      badgeText: '103.3%',
      badgeBg: '$success600',
      badgeTextColor: '$white',
      color: '$success600',
    },
    {
      id: 'current-savings',
      title: 'Current Savings',
      value: 'R4,075',
      subtitle: '232.7% from baseline',
      badgeText: '232.7%',
      badgeBg: '$success600',
      badgeTextColor: '$white',
      color: '$success600',
    },
    {
      id: 'iga-status',
      title: 'IGA Status',
      value: 'Active',
      subtitle: 'Small business - retail',
      color: '$success600',
    },
    {
      id: 'self-efficacy-score',
      title: 'Self-Efficacy Score',
      value: '99/100',
      subtitle: 'High self-efficacy',
      color: '$blue500',
    },
    {
      id: 'savings-frequency',
      title: 'Savings Frequency',
      value: 'Monthly',
      subtitle: 'Regular savings',
    },
    {
      id: 'savings-location',
      title: 'Savings Location',
      value: 'Bank account',
      subtitle: 'Formal savings',
    },
    {
      id: 'record-keeping',
      title: 'Record Keeping',
      value: 'Digital records',
      subtitle: 'Good practices',
    },
    {
      id: 'debt-status',
      title: 'Debt Status',
      value: 'R4,860',
      subtitle: 'Outstanding debt',
      color: '$warning500',
    },
  ];

  const renderKpiCard = (metric: (typeof metricCards)[number]) => {
    // Income + Savings (with green delta badge)
    if (metric.id === 'current-monthly-income' || metric.id === 'current-savings') {
      return (
        <Card
          bg="$white"
          borderRadius="$xl"
          p="$4"
          borderWidth={1}
          borderColor="$borderColor"
          variant="elevated"
        >
          <VStack space="sm">
            <Text fontSize="$sm" color="$textSecondary">
              {metric.title}
            </Text>

            <Text fontSize="$2xl" fontWeight="$bold" color="$success700">
              {metric.value}
            </Text>

            <Text fontSize="$xs" color="$textMutedForeground">
              {metric.subtitle}
            </Text>

            <HStack>
              <Box
                bg="$success700"
                px="$3"
                py="$1"
                borderRadius="$md"
                alignItems="center"
                justifyContent="center"
                flexDirection="row"
              >
                <LucideIcon name="TrendingUp" size={14} color="$white" />
                <Text ml="$1" fontSize="$xs" fontWeight="$semibold" color="$white">
                  {metric.badgeText}
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Card>
      );
    }

    // IGA Status (green dot + label)
    if (metric.id === 'iga-status') {
      return (
        <Card
          bg="$white"
          borderRadius="$xl"
          p="$4"
          borderWidth={1}
          borderColor="$borderColor"
          variant="elevated"
        >
          <VStack space="sm">
            <Text fontSize="$sm" color="$textSecondary">
              {metric.title}
            </Text>

            <HStack alignItems="center" space="sm">
              <Box width={10} height={10} borderRadius={999} bg="$success600" />
              <Text fontSize="$lg" fontWeight="$bold" color="$success700">
                {metric.value}
              </Text>
            </HStack>

            <Text fontSize="$xs" color="$textMutedForeground">
              {metric.subtitle}
            </Text>
          </VStack>
        </Card>
      );
    }

    // Debt Status (orange dot + value)
    if (metric.id === 'debt-status') {
      return (
        <Card
          bg="$white"
          borderRadius="$xl"
          p="$4"
          borderWidth={1}
          borderColor="$borderColor"
          variant="elevated"
        >
          <VStack space="sm">
            <Text fontSize="$sm" color="$textSecondary">
              {metric.title}
            </Text>
            <HStack alignItems="center" space="sm">
              <Box width={10} height={10} borderRadius={999} bg="$warning500" />
              <Text fontSize="$lg" fontWeight="$bold" color="$warning600">
                {metric.value}
              </Text>
            </HStack>
            <Text fontSize="$xs" color="$textMutedForeground">
              {metric.subtitle}
            </Text>
          </VStack>
        </Card>
      );
    }

    // Default: small simple card (Savings Frequency/Location/Record Keeping)
    return (
      <Card
        bg="$white"
        borderRadius="$xl"
        p="$4"
        borderWidth={1}
        borderColor="$borderColor"
        variant="elevated"
      >
        <VStack space="sm">
          <Text fontSize="$sm" color="$textSecondary">
            {metric.title}
          </Text>
          <Text fontSize="$lg" fontWeight="$bold" color="$textForeground">
            {metric.value}
          </Text>
          <Text fontSize="$xs" color="$textMutedForeground">
            {metric.subtitle}
          </Text>
        </VStack>
      </Card>
    );
  };

  // Combined graphs from all individual indicators
  const graphsBlocks: DashboardGraphBlock[] = [
    {
      id: 'income-trend',
      kind: 'reportSection',
      sectionTitle: 'Monthly income progression',
      sectionMeta: 'Income trend from baseline to current',
      chart: {
        kind: 'line',
        title: 'Monthly income progression',
        line: {
          color: '#2563EB',
          yAxisLabel: 'Income (R)',
          valueLabel: 'Monthly Income',
          data: [
            { month: 'Jul', value: 1900 },
            { month: 'Aug', value: 2100 },
            { month: 'Sep', value: 2400 },
            { month: 'Oct', value: 2800 },
            { month: 'Nov', value: 3200 },
            { month: 'Dec', value: 3606 },
          ],
        },
      },
    },
    {
      id: 'savings-trend',
      kind: 'reportSection',
      sectionTitle: 'Monthly savings progression',
      sectionMeta: 'Savings trend from baseline to current',
      chart: {
        kind: 'line',
        title: 'Monthly savings progression',
        line: {
          color: '#22C55E',
          yAxisLabel: 'Savings (R)',
          valueLabel: 'Monthly Savings',
          data: [
            { month: 'Jul', value: 1500 },
            { month: 'Aug', value: 1800 },
            { month: 'Sep', value: 2200 },
            { month: 'Oct', value: 2800 },
            { month: 'Nov', value: 3400 },
            { month: 'Dec', value: 4075 },
          ],
        },
      },
    },
    {
      id: 'income-sources',
      kind: 'reportSection',
      sectionTitle: 'Current month income by source',
      sectionMeta: 'Income distribution across different sources',
      chart: {
        kind: 'bar',
        title: 'Current month income by source',
        bar: {
          orientation: 'horizontal',
          yAxisLabel: 'Source',
          valueLabel: 'Amount (R)',
          data: [
            { label: 'Business', value: 1803, color: '#2563EB' },
            { label: 'Grants', value: 901, color: '#3B82F6' },
            { label: 'Employment', value: 360, color: '#60A5FA' },
            { label: 'Remittances', value: 360, color: '#60A5FA' },
            { label: 'Other', value: 180, color: '#93C5FD' },
          ],
        },
      },
    },
    {
      id: 'self-efficacy-progress',
      kind: 'reportSection',
      sectionTitle: 'Score progression over program',
      sectionMeta: 'Self-efficacy score improvement over time',
      chart: {
        kind: 'line',
        title: 'Score progression over program',
        line: {
          color: '#8B5CF6',
          yAxisLabel: 'Score (0-100)',
          valueLabel: 'Self-Efficacy Score',
          data: [
            { month: 'Baseline', value: 55 },
            { month: 'Midline', value: 70 },
            { month: 'Current', value: 99 },
          ],
        },
      },
    },
    {
      id: 'business-profitability',
      kind: 'reportSection',
      sectionTitle: 'Monthly profit progression',
      sectionMeta: 'Business profitability trend over time',
      chart: {
        kind: 'line',
        title: 'Monthly profit progression',
        line: {
          color: '#16A34A',
          yAxisLabel: 'Profit (R)',
          valueLabel: 'Monthly Profit',
          data: [
            { month: 'Jul', value: 250 },
            { month: 'Aug', value: 320 },
            { month: 'Sep', value: 410 },
            { month: 'Oct', value: 520 },
            { month: 'Nov', value: 640 },
            { month: 'Dec', value: 750 },
          ],
        },
      },
    },
    {
      id: 'sense-of-agency',
      kind: 'reportSection',
      sectionTitle: 'Participant self-assessment',
      sectionMeta: 'Agency and control indicators',
      summary: {
        extras: [
          {
            id: 'agency-indicator',
            kind: 'tiles',
            items: [
              {
                id: 'agency-status',
                title: 'Feels in control of their life',
                value: 'Positive agency indicator',
                valueColor: '#16A34A',
                bg: '#ECFDF5',
                borderColor: '#BBF7D0',
              },
            ],
          },
        ],
      },
      chart: { kind: 'placeholder', title: '', placeholderText: '' },
    },
  ];

  return (
    <VStack space="lg">
      {/* Pink banner (matches screenshot) */}
      <Card
        variant="outline"
        borderRadius="$xl"
        borderColor="$error200"
        bg="$error50"
        p="$5"
      >
        <HStack space="md" alignItems="flex-start">
          <Box
            width={28}
            height={28}
            borderRadius={999}
            bg="$white"
            borderWidth={1}
            borderColor="$error200"
            alignItems="center"
            justifyContent="center"
            mt="$0.5"
          >
            <LucideIcon name="Target" size={16} color="$error600" />
          </Box>

          <VStack space="sm" flex={1}>
            <Text fontSize="$lg" fontWeight="$bold" color="$textForeground">
              Individual Outcome Indicators
            </Text>
            <Text fontSize="$sm" color="$textMutedForeground">
              Select a participant below to view their individual outcome trends based on survey responses and assessment data.
            </Text>

            <HStack alignItems="center" space="md" flexWrap="wrap">
              <Text fontSize="$sm" color="$textForeground" fontWeight="$medium">
                Viewing data for:
              </Text>
              <Box flex={1} minWidth={260}>
                <Select
                  options={participantOptions}
                  value={selectedParticipant}
                  onChange={(val: string) => setSelectedParticipant(val)}
                  placeholder="Select a participant"
                />
              </Box>
            </HStack>
          </VStack>
        </HStack>
      </Card>

      {/* Metric Cards - Top Row (4 cards) */}
      <HStack flexWrap="wrap" gap="$4" justifyContent="space-between">
        {metricCards.slice(0, 4).map(metric => {
          if (metric.id === 'self-efficacy-score') {
            return (
              <Box key={metric.id} flexBasis="calc(50% - 8px)" $md={{ flexBasis: 'calc(25% - 12px)' }}>
                <Card
                  bg="$white"
                  borderRadius="$xl"
                  p="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                  variant="elevated"
                >
                  <VStack space="sm">
                    <Text fontSize="$sm" color="$textSecondary">
                      {metric.title}
                    </Text>
                    <Text fontSize="$2xl" fontWeight="$bold" color="$blue500">
                      {metric.value}
                    </Text>
                    <Progress
                      value={99}
                      w="$full"
                      h="$2"
                      bg="$progressBarBackground"
                      borderRadius="$full"
                    >
                      <ProgressFilledTrack bg="$blue500" />
                    </Progress>
                  </VStack>
                </Card>
              </Box>
            );
          }

          return (
            <Box key={metric.id} flexBasis="calc(50% - 8px)" $md={{ flexBasis: 'calc(25% - 12px)' }}>
              {renderKpiCard(metric)}
            </Box>
          );
        })}
      </HStack>

      {/* Metric Cards - Middle Row (4 cards) */}
      <HStack flexWrap="wrap" gap="$4" justifyContent="space-between">
        {metricCards.slice(4, 8).map(metric => (
          <Box key={metric.id} flexBasis="calc(50% - 8px)" $md={{ flexBasis: 'calc(25% - 12px)' }}>
            {renderKpiCard(metric)}
          </Box>
        ))}
      </HStack>

      {/* Trend Charts */}
      <DashboardGraphs blocks={graphsBlocks} fallbackPlaceholderKey="common.comingSoon" columns={2} />
    </VStack>
  );
};

export default IndividualOutcomeIndicators;
