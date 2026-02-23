import React from 'react';
import { VStack, HStack, Button, Text, Image } from '@ui';
import { View } from 'react-native';

import UploadIcon from '../../assets/images/UploadIcon.png';
import ExportIcon from '../../assets/images/ExportIcon.png';
import { useLanguage } from '@contexts/LanguageContext';
import BulkOperationsCard from '../../components/BulkOperationsCard';
import StatCard, { StatsRow } from '@components/StatCard';
import { USER_MANAGEMENT_STATS } from '@constants/USER_MANAGEMENT_STATS';
import {
  SearchFilter,
  FilterOptions,
} from '@constants/USER_MANAGEMENT_FILTERS';
import FilterButton from '@components/Filter';
import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const data = [SearchFilter, ...FilterOptions];

  return (
    <VStack space="md" width="100%">
      <TitleHeader
        title="admin.menu.userManagement"
        description="admin.userManagementDescription"
        right={
          <HStack space="md" alignItems="center">
            <Button
              {...titleHeaderStyles.outlineButton}
              onPress={() => {
                // Handle bulk upload
              }}
            >
              <HStack space="sm" alignItems="center">
                <Image
                  source={UploadIcon}
                  style={{ width: 16, height: 16 }}
                  alt="Upload icon"
                />
                <Text {...titleHeaderStyles.outlineButtonText}>
                  {t('admin.actions.bulkUploadCSV')}
                </Text>
              </HStack>
            </Button>

            <Button
              {...titleHeaderStyles.solidButton}
              onPress={() => {
                // Handle create user
              }}
            >
              <HStack space="sm" alignItems="center">
                <Image
                  source={ExportIcon}
                  style={{ width: 16, height: 16 }}
                  alt="Export icon"
                />
                <Text {...titleHeaderStyles.solidButtonText}>
                  {t('admin.actions.createUser')}
                </Text>
              </HStack>
            </Button>
          </HStack>
        }
      />

      <FilterButton data={data} />

      <BulkOperationsCard />
      {/* Stats and Bulk Operations - Display after table */}
      <View style={{ marginTop: 24, width: '100%' }}>
        <StatsRow>
          {USER_MANAGEMENT_STATS.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              count={stat.count}
              subLabel={stat.subLabel}
              color={stat.color}
            />
          ))}
        </StatsRow>
      </View>
    </VStack>
  );
};

export default UserManagementScreen;
