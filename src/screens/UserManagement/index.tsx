import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { VStack, HStack, Button, Text, Image, Box } from '@ui';
import { LucideIcon } from '@ui/index';

import UploadIcon from '../../assets/images/UploadIcon.png';
import ExportIcon from '../../assets/images/ExportIcon.png';
import { useLanguage } from '@contexts/LanguageContext';
import { useUserManagementFilters, mapStatusLabelToAPI } from '@constants/USER_MANAGEMENT_FILTERS';
import FilterButton from '@components/Filter';
import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import DataTable from '@components/DataTable';
import { getUsersColumns } from './UsersTableConfig';
import { AdminUserManagementData } from '@app-types/participant';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { usePlatform } from '@utils/platform';
import { styles } from './Styles';
import { getParticipantsList, Role } from '../../services/participantService';
import type { ParticipantSearchParams } from '@app-types/participant';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const { isMobile } = usePlatform();
  
  // API state management
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [users, setUsers] = useState<AdminUserManagementData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  // Note: currentPage and pageSize are managed by DataTable component for client-side pagination
  // API pageSize is set to 100 to fetch all users at once
  
  const columns = useMemo(() => getUsersColumns(), []);
  
  // Ref to track previous roles length to detect when roles are first loaded
  const prevRolesLengthRef = useRef(0);

  // Use custom hook for filter management - handles all API calls for roles, provinces
  const { filters: filterOptions, roles, provinces } = useUserManagementFilters(filters);

  // Fetch users from API when filters change or when roles are first loaded
  useEffect(() => {
    // Check if roles just loaded (length changed from 0 to > 0)
    const rolesJustLoaded = prevRolesLengthRef.current === 0 && roles.length > 0;
    prevRolesLengthRef.current = roles.length;

    // Don't fetch if roles haven't loaded yet (needed for type parameter)
    // Unless a specific role filter is set or roles just loaded
    if (roles.length === 0 && !filters.role && !rolesJustLoaded) {
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Determine type parameter based on role filter
        // When "All Roles" is selected, use all role titles from API
        let apiType: string;
        if (filters.role && filters.role !== 'all-roles') {
          // Filter value is already the role title (not label), so use it directly
          apiType = filters.role;
        } else {
          // Build type parameter from all active roles fetched from API
          // Extract unique role titles from roles array
          const allRoleTitles = roles
            .map((role: Role) => role.title)
            .filter((title: string | undefined): title is string => !!title)
            .filter((title: string, index: number, self: string[]) => self.indexOf(title) === index); // Remove duplicates
          
          // Use all role titles from API, or 'all' if no roles available
          apiType = allRoleTitles.length > 0 ? allRoleTitles.join(',') : 'all';
        }

        const apiParams: ParticipantSearchParams = {
          tenant_code: 'brac',
          type: apiType,
          page: 1, // Always fetch from page 1, DataTable handles client-side pagination
          limit: 100, // Fetch all users at once for client-side pagination
        };

        if (filters.search) {
          apiParams.search = filters.search;
        }
        if (filters.status && filters.status !== 'all-status') {
          // Map status filter value to API format (e.g., "Active" → "ACTIVE")
          const mappedStatus = mapStatusLabelToAPI(filters.status);
          apiParams.status = mappedStatus;
        }
        if (filters.province && filters.province !== 'all-provinces') {
          // Since we're using province.name as both label and value, use it directly
          // The API expects the province name (e.g., "Eastern Cape")
          apiParams.province = filters.province;
        }

        const response = await getParticipantsList(apiParams);
        
        // Get raw API data
        let usersData = response.result?.data || [];
        
        // Get total count from API response (if available), otherwise use data length
        const apiTotalCount = response.result?.count ?? usersData.length;
        
        // Apply client-side status filtering if status filter is set (fallback if API doesn't filter)
        // This ensures status filter works even if API doesn't support status parameter
        if (filters.status && filters.status !== 'all-status') {
          const mappedStatus = mapStatusLabelToAPI(filters.status);
          usersData = usersData.filter((user: any) => {
            const userStatus = user.status?.toUpperCase();
            return userStatus === mappedStatus;
          });
        }
        
        setUsers(usersData);
        // Use API total count, not the length of returned data
        setTotalCount(apiTotalCount);
      } catch (error) {
        setUsers([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, roles.length]); // Depend on filters and roles.length to trigger when roles first load

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    // DataTable will reset to page 1 automatically when data changes
  }, []);


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
      
      <FilterButton 
        data={filterOptions}
        onFilterChange={handleFilterChange}
      />
      
      {/* Table Header with Title, Count, and Export Button */}
      <Box {...styles.tableContainer}>
        <HStack {...styles.tableHeader}>
          <Text {...TYPOGRAPHY.h4} color="$textForeground" fontWeight="$normal">
            {t('admin.users.allUsers')}
          </Text>
          <HStack {...styles.tableHeaderActions}>
            {!isMobile && (
              <Text {...TYPOGRAPHY.bodySmall} color="$textMutedForeground">
                {t('admin.users.showing', {
                  count: users.length,
                  total: totalCount || users.length,
                })}
              </Text>
            )}
            <Button
              {...titleHeaderStyles.outlineButton}
              onPress={() => {
                // Handle Export CSV
              }}
            >
              <HStack space="xs" alignItems="center">
                <LucideIcon
                  name="Download"
                  size={16}
                />
                <Text {...TYPOGRAPHY.bodySmall} fontWeight="$medium">
                  {t('admin.actions.exportCSV')}
                </Text>
              </HStack>
            </Button>
          </HStack>
        </HStack>

        {/* DataTable with raw API data */}
        <DataTable
          key={`users-table-${JSON.stringify(filters)}`} // Force remount when filters change to reset pagination
          data={users}
          columns={columns}
          getRowKey={(user) => user.id}
          isLoading={isLoading}
          pagination={{
            enabled: true,
            pageSize: 10, // Display 10 users per page
            showPageSizeSelector: false,
            pageSizeOptions: [10, 25, 50, 100],
          }}
          onPageChange={(newPage) => {
            // Note: This is for client-side pagination only
            // The DataTable handles pagination internally
          }}
          emptyMessage="admin.users.noUsersFound"
          loadingMessage="admin.users.loadingUsers"
        />
      </Box>
    </VStack>
  );
};

export default UserManagementScreen;
