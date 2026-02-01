import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Pressable,
  Container,
  ScrollView,
  Select,
} from '@ui';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '@components/SearchBar';
import DataTable from '@components/DataTable';
import { getParticipantsColumns } from './ParticipantsTableConfig';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { Participant, StatusCount, StatusType } from '@app-types/screens';
import { useLanguage } from '@contexts/LanguageContext';
import { getStatusItems } from '@constants/FILTERS';
import { getParticipantsList } from '../../services/participantService';
import { STATUS } from '@constants/app.constant';
import { usePlatform } from '@utils/platform';
import { styles } from './Styles';
import { useAuth } from '@contexts/AuthContext';
import logger from '@utils/logger';

/**
 * ParticipantsList Screen
 * Handles all screen-specific logic: navigation and dropout modal.
 */
const ParticipantsList: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { isMobile } = usePlatform();
  const { user } = useAuth();

  // State management
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeStatus, setActiveStatus] = useState<StatusType | ''>(
    STATUS.NOT_ENROLLED,
  );
  const [searchKey, setSearchKey] = useState('');
  const [activeFilter, setActiveFilter] = useState<'active' | 'inactive'>('active');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate status counts dynamically from participants data
  const statusCounts = useMemo<StatusCount>(() => {
    const counts: StatusCount = {
      'Not Onboarded': 0,
      'Onboarded': 0,
      'In Progress': 0,
      'Completed': 0,
      'Dropped out': 0,
      'Graduated': 0,
    };

    participants.forEach(participant => {
      if (participant.status) {
        const status = participant.status as StatusType;
        if (status in counts) {
          counts[status] = (counts[status] || 0) + 1;
        }
      }
    });

    return counts;
  }, [participants]);

  // Get status items with current counts
  const allStatusItems = getStatusItems(statusCounts);
  
  // Filter status items based on active/inactive filter
  const statusItems = useMemo(() => {
    // Active
    if (activeFilter === 'active') {
      return allStatusItems.filter(item => 
        item.key === STATUS.NOT_ENROLLED ||
        item.key === STATUS.ENROLLED || 
        item.key === STATUS.IN_PROGRESS ||
        item.key === STATUS.COMPLETED 
      );
    } else {
      // inactive
      return allStatusItems.filter(item => 
        item.key === STATUS.DROPOUT ||
        item.key === STATUS.GRADUATED
      );
    }
  }, [allStatusItems, activeFilter]);

  // Calculate counts for Active and Inactive filters
  const activeInactiveCounts = useMemo(() => {
    const activeCount = allStatusItems
      .filter(item => 
        item.key === STATUS.NOT_ENROLLED ||
        item.key === STATUS.ENROLLED || 
        item.key === STATUS.IN_PROGRESS ||
        item.key === STATUS.COMPLETED
      )
      .reduce((sum, item) => sum + item.count, 0);
    
    const inactiveCount = allStatusItems
      .filter(item => 
        item.key === STATUS.DROPOUT ||
        item.key === STATUS.GRADUATED
      )
      .reduce((sum, item) => sum + item.count, 0);
    
    return { active: activeCount, inactive: inactiveCount };
  }, [allStatusItems]);

  // Format status items for Select dropdown (mobile)
  const selectOptions = useMemo(() => {
    return statusItems.map(item => ({
      label: `${t(item.label)} (${item.count})`,
      value: item.key,
    }));
  }, [statusItems, t]);

  useEffect(() => {
    const fetchParticipants = async () => {
      // Early return if entity ID is not available
      // if (!user?.entityDetails?._id) {
      //   return;
      // }

      try {
        const response = await getParticipantsList({
          search: searchKey,
          userId: user.id,
        });
        setParticipants(response.result.data || []);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch participants';
        logger.error('Error fetching participants:', errorMessage, err);
        // Optionally set empty array on error to prevent stale data
        setParticipants([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParticipants();
  }, [searchKey, user]);

  // When Active/Inactive filter changes, set default status
  useEffect(() => {
    if (activeFilter === 'inactive') {
      setActiveStatus(STATUS.GRADUATED);
    } else if (activeFilter === 'active') {
      // Set default to NOT_ENROLLED when Active is selected
      setActiveStatus(STATUS.NOT_ENROLLED);
    }
  }, [activeFilter]);

  // Handlers
  const handleSearch = useCallback((text: string) => {
    // Search functionality can be implemented here when needed
    setSearchKey(text);
  }, []);

  const handleStatusChange = useCallback((status: StatusType | '') => {
    setActiveStatus(status);
  }, []);

  const handleRowClick = useCallback(
    (participant: Participant) => {
      // @ts-ignore
      navigation.navigate('participant-detail', {
        id: participant.userId,
      });
    },
    [navigation],
  );

  return (
    <Box {...styles.mainContainer}>
      <ScrollView {...styles.scrollView}>
        <VStack {...styles.headerVStack}>
          <Container>
            <Heading {...TYPOGRAPHY.h4} color="text-foreground" {...styles.heading}>
              {t('participants.myParticipants')}
            </Heading>
          </Container>
          </VStack>
      
        <Container>
          <VStack {...styles.contentVStack}>
            {/* Search Bar and Active/Inactive Filter */}
            <HStack {...styles.searchFilterHStack}>
              <Box {...styles.searchBarContainer}>
                <SearchBar
                  placeholder={t('participants.searchByNameOrId')}
                  onSearch={handleSearch}
                  debounceMs={500}
                  defaultValue={searchKey}
                />
              </Box>
              <Box {...styles.selectContainer}>
                <Select
                  options={[
                    { label: `${t('participants.active')} (${activeInactiveCounts.active})`, value: 'active' },
                    { label: `${t('participants.inactive')} (${activeInactiveCounts.inactive})`, value: 'inactive' },
                  ]}
                  value={activeFilter}
                  onChange={(value) => setActiveFilter(value as 'active' | 'inactive')}
                  {...styles.select}
                />
              </Box>
            </HStack>

            {/* Status Filter Bar - Desktop: Filter buttons, Mobile: Dropdown */}
            {isMobile ? (
              <Box {...styles.mobileStatusSelectContainer}>
                <Select
                  options={selectOptions}
                  value={activeStatus}
                  onChange={(value) => handleStatusChange(value as StatusType | '')}
                  placeholder={t('participants.selectStatus') || 'Select Status'}
                  {...styles.select}
                />
              </Box>
            ) : (
              <Box {...styles.desktopFilterContainer}>
                <HStack {...styles.desktopFilterHStack}>
                  {statusItems.map(item => {
                    const isActive = activeStatus === item.key;

                    return (
                      <Pressable
                        key={item.key}
                        onPress={() => handleStatusChange(item.key)}
                        {...styles.statusItemPressable}
                        {...(isActive ? styles.statusItemPressableActive : styles.statusItemPressableInactive)}
                      >
                        <HStack {...styles.statusItemHStack}>
                          <Text
                            {...styles.statusLabelText}
                            {...(isActive ? styles.statusLabelTextActive : styles.statusLabelTextInactive)}
                          >
                            {t(item.label)}
                          </Text>
                          <Box
                            {...styles.countBadgeBox}
                            {...(isActive ? styles.countBadgeBoxActive : styles.countBadgeBoxInactive)}
                          >
                            <Text
                              {...styles.countText}
                              {...(isActive ? styles.countTextActive : styles.countTextInactive)}
                            >
                              {item.count}
                            </Text>
                          </Box>
                        </HStack>
                      </Pressable>
                    );
                  })}
                </HStack>
              </Box>
            )}

            {/* Participants Table */}
            <DataTable
              data={participants}
              columns={getParticipantsColumns(activeStatus)}
              getRowKey={participant => participant.id}
              onRowClick={handleRowClick}
              isLoading={isLoading}
              emptyMessage={t('participants.noParticipantsFound')}
              loadingMessage={t('participants.loadingParticipants')}
              pagination={{
                enabled: true,
                pageSize: 6,
                maxPageNumbers: 5,
              }}
            />
          </VStack>
        </Container>
      </ScrollView>
    </Box>
  );
};

export default ParticipantsList;
