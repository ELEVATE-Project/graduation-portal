/**
 * Assign Users Filter Configurations
 * Data-driven filter definitions for the Assign Users screen
 * All filter logic for assigning LCs to Supervisors and Participants to LCs
 */

import { useState, useEffect, useMemo } from 'react';
import { getProvincesList, getSitesByProvince } from '../services/usersService';
import { getSupervisorsByProvince } from '../services/assignUsersService';
import type { FilterConfig } from './USER_MANAGEMENT_FILTERS';
import type { ProvinceEntity, AdminUserManagementData, SiteEntity } from '@app-types/Users';

// Search filter for LC assignment
export const SearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

// Search filter for participant assignment
export const ParticipantSearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

/**
 * Hook to get supervisor filter options with dynamic disabled state
 * Fetches provinces from API and disables supervisor filter until a province is selected
 * 
 * @param filters - Current filter values to check if province is selected
 * @returns Object containing filter configurations and supervisors data
 */
export const useSupervisorFilterOptions = (filters: Record<string, any> = {}): {
  filters: ReadonlyArray<FilterConfig>;
  supervisors: AdminUserManagementData[];
} => {
  // State for API data
  const [provinces, setProvinces] = useState<ProvinceEntity[]>([]);
  const [supervisors, setSupervisors] = useState<AdminUserManagementData[]>([]);

  // Fetch provinces from API on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      const provincesData = await getProvincesList();
      setProvinces(provincesData);
    };

    fetchProvinces();
  }, []);

  // Fetch supervisors when province filter changes
  useEffect(() => {
    const fetchSupervisors = async () => {
      const selectedProvince = filters.filterByProvince;
      
      // Only fetch supervisors if a specific province is selected (not "all-provinces")
      if (!selectedProvince || selectedProvince === 'all-provinces' || selectedProvince === 'all-Provinces') {
        setSupervisors([]);
        return;
      }

      try {
        // Fetch supervisors for the selected province
        const supervisorsResponse = await getSupervisorsByProvince(selectedProvince, {
          page: 1,
          limit: 100,
        });
        const supervisorsData = supervisorsResponse.result?.data || [];
        setSupervisors(supervisorsData);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
        setSupervisors([]);
      }
    };

    fetchSupervisors();
  }, [filters.filterByProvince]); // Re-fetch when province filter changes

  // Build dynamic filter options with API data
  return useMemo(() => {
    // Build province filter from API provinces
    const provinceFilterOptions = [
      { labelKey: 'admin.filters.allProvinces', value: 'all-provinces' },
      ...provinces.map((province: ProvinceEntity) => ({
        label: province.name,
        value: province._id, // Use _id as value for filtering
      })),
    ];

    // Determine if supervisor filter should be disabled
    const selectedProvince = filters.filterByProvince;
    const isProvinceSelected = selectedProvince &&
                               selectedProvince !== 'all-provinces' &&
                               selectedProvince !== 'all-Provinces';
    const shouldDisableSupervisorFilter = !isProvinceSelected; // Disable until a province is selected

    // Build supervisor filter from API supervisors
    const supervisorFilterOptions = supervisors.map((supervisor: any) => {
      const name = supervisor.name || supervisor.full_name || supervisor.email || 'Unknown';
      const value = supervisor.id || supervisor._id || supervisor.email || name;
      return {
        label: name,
        value: value,
      };
    });

    return {
      filters: [
        {
          nameKey: 'admin.filters.filterByProvince',
          attr: 'filterByProvince',
          type: 'select' as const,
          data: provinceFilterOptions,
        },
        {
          nameKey: 'admin.filters.selectSupervisor',
          attr: 'selectSupervisor',
          type: 'select' as const,
          placeholderKey: 'admin.filters.chooseSupervisor',
          data: supervisorFilterOptions,
          disabled: shouldDisableSupervisorFilter, // Disable until province is selected
        },
      ],
      supervisors, // Return supervisors data for accessing location and other details
    };
  }, [provinces, supervisors, filters.filterByProvince]);
};

/**
 * Hook to get site filter options with dynamic disabled state
 * Fetches sites from API based on province selected in Step 1
 * Disables site filter until a province is selected
 * 
 * @param selectedProvinceId - Province ID selected in Step 1 (from supervisorFilterValues.filterByProvince)
 * @returns Object containing site filter configuration
 */
export const useSiteFilterOptions = (selectedProvinceId?: string): {
  filters: ReadonlyArray<FilterConfig>;
  sites: SiteEntity[];
} => {
  // State for API data
  const [sites, setSites] = useState<SiteEntity[]>([]);

  // Fetch sites when province filter changes
  useEffect(() => {
    const fetchSites = async () => {
      // Only fetch sites if a specific province is selected (not "all-provinces")
      if (!selectedProvinceId || selectedProvinceId === 'all-provinces' || selectedProvinceId === 'all-Provinces') {
        setSites([]);
        return;
      }

      try {
        // Fetch sites for the selected province
        const sitesResponse = await getSitesByProvince(selectedProvinceId, {
          page: 1,
          limit: 100,
        });
        const sitesData = sitesResponse.result?.data || [];
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching sites:', error);
        setSites([]);
      }
    };

    fetchSites();
  }, [selectedProvinceId]); // Re-fetch when province changes

  // Build dynamic filter options with API data
  return useMemo(() => {
    // Determine if site filter should be disabled
    const isProvinceSelected = selectedProvinceId &&
                               selectedProvinceId !== 'all-provinces' &&
                               selectedProvinceId !== 'all-Provinces';
    const shouldDisableSiteFilter = !isProvinceSelected; // Disable until a province is selected

    // Build site filter from API sites
    const siteFilterOptions = [
      { labelKey: 'admin.filters.allSites', value: 'all-sites' },
      ...sites.map((site: SiteEntity) => ({
        label: site.name,
        value: site._id, // Use _id as value for filtering
      })),
    ];

    return {
      filters: [
        {
          nameKey: 'admin.filters.site',
          attr: 'site',
          type: 'select' as const,
          placeholderKey: 'admin.filters.chooseSite',
          data: siteFilterOptions,
          disabled: shouldDisableSiteFilter, // Disable until province is selected
        },
      ],
      sites, // Return sites data for accessing details
    };
  }, [sites, selectedProvinceId]);
};

export const selectedLCList = [
  {
    labelKey: 'Busisiwe Ngcobo',
    value: 'Busisiwe-Ngcobo',
    location: 'eThekwini, KwaZulu-Natal',
    status: 'unassigned',
  },
  {
    labelKey: 'Andile Mkhize',
    value: 'Andile-Mkhize',
    location: 'Johannesburg, Gauteng',
    status: 'unassigned',
  },
];

export const participantLCFilterOptions = [
  {
    nameKey: 'admin.filters.selectSupervisor',
    attr: 'selectSupervisor',
    type: 'select',
    placeholderKey: 'admin.filters.chooseSupervisor',
    data: [
      {
        labelKey: 'Dr. Lerato Mokoena Johannesburg',
        value: 'Dr. Lerato Mokoena Johannesburg ',
      },
      {
        labelKey: 'Zanele Ndabae Thekwini',
        value: 'Zanele Ndabae Thekwini',
      },
    ],
  },
  {
    nameKey: 'admin.filters.selectLC',
    attr: 'selectLC',
    type: 'select',
    placeholderKey: 'admin.filters.chooseLC',
    data: [], // Will be populated dynamically based on selected supervisor
  },
];

// Participant filter options for Step 3
export const participantFilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.bio',
    attr: 'bio',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allBio', value: 'all' },
      { labelKey: 'admin.filters.youthDevelopment', value: 'youth-development' },
      { labelKey: 'admin.filters.skillsTraining', value: 'skills-training' },
      { labelKey: 'admin.filters.entrepreneurship', value: 'entrepreneurship' },
    ],
  },
  {
    nameKey: 'admin.filters.productivity',
    attr: 'productivity',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allProductivity', value: 'all' },
      { labelKey: 'admin.filters.high', value: 'high' },
      { labelKey: 'admin.filters.medium', value: 'medium' },
      { labelKey: 'admin.filters.low', value: 'low' },
    ],
  },
];

// Mock participant data for Step 3
export const participantList = [
  {
    labelKey: 'Thandeka Zungu',
    value: 'thandeka-zungu',
    bio: 'Youth Development',
    productivity: 'High',
    status: 'unassigned',
  },
  {
    labelKey: 'Lebohang Molefe',
    value: 'lebohang-molefe',
    bio: 'Entrepreneurship',
    productivity: 'Low',
    status: 'unassigned',
  },
  {
    labelKey: 'Zanele Kgotso',
    value: 'zanele-kgotso',
    bio: 'Skills Training',
    productivity: 'Medium',
    status: 'unassigned',
  },
];
