import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, VStack, HStack, Text, Heading, Pressable, ScrollView } from '@ui';
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

const ParticipantsList: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  // State management
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [statusCounts] = useState<StatusCount>({
    not_enrolled: 5,
    enrolled: 11,
    in_progress: 13,
    completed: 6,
    dropped_out: 0,
  });

  const [activeStatus, setActiveStatus] = useState<StatusType | ''>(
    STATUS.NOT_ENROLLED,
  );
  const [_searchKey, setSearchKey] = useState('');
  const [isLoading] = useState(false);
  const [_page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Get status items with current counts
  const statusItems = getStatusItems(statusCounts);

  useEffect(() => {
    // Set mock participants data
    const participants = getParticipantsList();
    setParticipants(participants);
    setTotalCount(participants.length);
  }, []);

  const filteredParticipants = useMemo(() => {
    // Example placeholder logic until API integration:
    const term = _searchKey.trim().toLowerCase();
    const participants = getParticipantsList();
    return participants.filter((p: Participant) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term);
      // If/when Participant has a status field, also filter on activeStatus here.
      return matchesSearch;
    });
  }, [_searchKey]);

  // Handlers
  const handleSearch = useCallback((text: string) => {
    setSearchKey(text);
    setPage(1); // Reset to first page on search
  }, []);

  const handleStatusChange = useCallback((status: StatusType | '') => {
    setActiveStatus(status);
    setPage(1); // Reset to first page on filter change
  }, []);

  const handleRowClick = useCallback(
    (participant: Participant) => {
      // @ts-ignore
      navigation.navigate('participant-detail', {
        id: participant.id,
      });
      // navigation.navigate('project');
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
        <Heading
          {...TYPOGRAPHY.h4}
          color={theme.tokens.colors.foreground}
          bg="$white"
          padding="$4"
          my="$2"
        >
          {t('participants.myParticipants')}
        </Heading>
        <VStack space="lg" padding="$6" flex={1}>
          {/* Page Title */}

          {/* Search Bar */}
          <SearchBar
            placeholder={t('participants.searchByNameOrId')}
            onSearch={handleSearch}
            debounceMs={500}
          />

          {/* Status Filter Bar */}
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
          />

          {/* Pagination Info */}
          {!isLoading && participants.length > 0 && (
            <Box paddingVertical="$4">
              <Text
                {...TYPOGRAPHY.bodySmall}
                color={theme.tokens.colors.mutedForeground}
              >
                {t('participants.showingParticipants', {
                  count: participants.length,
                  total: totalCount,
                })}{' '}
              </Text>
            </Box>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ParticipantsList;
