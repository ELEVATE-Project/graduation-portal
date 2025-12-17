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
import { getParticipantsColumns } from '@components/DataTable/ParticipantsTableConfig';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { Participant, StatusCount, StatusType } from '@app-types/screens';
import { useLanguage } from '@contexts/LanguageContext';
import { getStatusItems } from '@constants/FILTERS';
import { getParticipantsList } from '../../services/participantService';
import { STATUS } from '@constants/app.constant';
import { usePlatform } from '@utils/platform';
import { applyFilters } from '@utils/helper';

const ParticipantsList: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { isMobile } = usePlatform();

  // State management
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeStatus, setActiveStatus] = useState<StatusType | ''>(
    STATUS.NOT_ENROLLED,
  );
  const [_searchKey, setSearchKey] = useState('');
  const [activeFilter, setActiveFilter] = useState<'active' | 'inactive'>('active');
  const [isLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

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
    // Set mock participants data
    const participants = getParticipantsList();
    setParticipants(participants);
    setTotalCount(participants.length);
  }, []);

  // When Active/Inactive filter changes, set default status
  useEffect(() => {
    if (activeFilter === 'inactive') {
      setActiveStatus(STATUS.GRADUATED);
    } else if (activeFilter === 'active') {
      // Set default to NOT_ENROLLED when Active is selected
      setActiveStatus(STATUS.NOT_ENROLLED);
    }
  }, [activeFilter]);

  const filteredParticipants = useMemo(() => {
    // Build filters object for applyFilters
    const filters: Record<string, any> = {};
    
    // Apply status filter if active
    if (activeStatus) {
      filters.status = activeStatus;
    }
    
    // Apply filters using helper function
    return applyFilters(participants, filters);
  }, [participants, activeStatus]);

  // Handlers
  const handleSearch = useCallback((text: string) => {
    setSearchKey(text);
  }, []);

  const handleStatusChange = useCallback((status: StatusType | '') => {
    setActiveStatus(status);
  }, []);

  const handleRowClick = useCallback(
    (participant: Participant) => {
      // @ts-ignore
      navigation.navigate('participant-detail', {
        id: participant.id,
      });
    },
    [navigation],
  );

  const handleDropout = useCallback((participant: Participant) => {
    console.log('Dropout participant:', participant.id);
    // TODO: Implement dropout logic - API call to mark participant as dropout
  }, []);

  return (
    <Box flex={1}>
      <ScrollView flex={1} bg={theme.tokens.colors.accent100}>
        <VStack bg="$white">
          <Container>
            <Heading {...TYPOGRAPHY.h4} color={theme.tokens.colors.foreground}  padding="$4" my="$2">
              {t('participants.myParticipants')}
            </Heading>
          </Container>
          </VStack>
      
        <Container>
          <VStack space="lg" padding="$0" $md-padding="$6" flex={1}>
            {/* Page Title */}
           

            {/* Search Bar and Active/Inactive Filter */}
            <HStack space="md" width="$full" alignItems="center">
              <Box flex={1}>
                <SearchBar
                  placeholder={t('participants.searchByNameOrId')}
                  onSearch={handleSearch}
                  debounceMs={500}
                />
              </Box>
              <Box width="$40" $md-width="$48">
                <Select
                  options={[
                    { label: `${t('participants.active')} (${activeInactiveCounts.active})`, value: 'active' },
                    { label: `${t('participants.inactive')} (${activeInactiveCounts.inactive})`, value: 'inactive' },
                  ]}
                  value={activeFilter}
                  onChange={(value) => setActiveFilter(value as 'active' | 'inactive')}
                  bg="$white"
                  borderColor="$borderLight300"
                />
              </Box>
            </HStack>

            {/* Status Filter Bar - Desktop: Filter buttons, Mobile: Dropdown */}
            {isMobile ? (
              <Box width="$full">
                <Select
                  options={selectOptions}
                  value={activeStatus}
                  onChange={(value) => handleStatusChange(value as StatusType | '')}
                  placeholder={t('participants.selectStatus') || 'Select Status'}
                  bg="$white"
                  borderColor="$borderLight300"
                />
              </Box>
            ) : (
              <Box
                bg="$backgroundLight50"
                borderRadius="$lg"
                padding="$1"
                width="$full"
              >
                <HStack space="xs" width="$full">
                  {statusItems.map(item => {
                    const isActive = activeStatus === item.key;

                    return (
                      <Pressable
                        key={item.key}
                        onPress={() => handleStatusChange(item.key)}
                        flex={1}
                        paddingVertical="$3"
                        paddingHorizontal="$2"
                        borderRadius="$md"
                        bg={isActive ? '$white' : 'transparent'}
                        $web-cursor="pointer"
                        $web-transition="all 0.2s"
                        sx={{
                          ':hover': {
                            opacity: 0.8,
                          },
                        }}
                      >
                        <HStack
                          space="xs"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            fontSize="$sm"
                            color={
                              isActive
                                ? theme.tokens.colors.primary500
                                : theme.tokens.colors.mutedForeground
                            }
                            fontWeight={isActive ? '$medium' : '$normal'}
                            textAlign="center"
                          >
                            {t(item.label)}
                          </Text>
                          <Box
                            bg={
                              isActive
                                ? theme.tokens.colors.primary500
                                : '$backgroundLight200'
                            }
                            borderRadius="$full"
                            paddingHorizontal="$2"
                            paddingVertical="$0.5"
                            minWidth={24}
                            height={20}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text
                              fontSize="$xs"
                              color={
                                isActive
                                  ? '$white'
                                  : theme.tokens.colors.mutedForeground
                              }
                              fontWeight="$semibold"
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
              data={filteredParticipants}
              columns={getParticipantsColumns(activeStatus)}
              getRowKey={participant => participant.id}
              onRowClick={handleRowClick}
              onActionClick={handleDropout}
              isLoading={isLoading}
              showActions={true}
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
