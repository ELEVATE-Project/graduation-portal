/**
 * User Management Filter Configurations
 * Data-driven filter definitions for the User Management screen
 * All filter logic integrated with API
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getRolesList,
  getEntityTypesList,
  getEntityTypesFromStorage,
  getProvincesByEntityType,
  getSitesByProvince,
} from '../services/usersService';
import type { Role, ProvinceEntity, SiteEntity } from '@app-types/Users';

// Type definition for filter configuration
export type FilterConfig = {
  name?: string; // Fallback if nameKey is not provided
  nameKey?: string; // Translation key for the filter name
  attr: string;
  type: 'search' | 'select';
  data: Array<
    string | { label?: string; labelKey?: string; value: string | null }
  >;
  placeholder?: string; // Fallback if placeholderKey is not provided
  placeholderKey?: string; // Translation key for the placeholder
  disabled?: boolean; // Disable the filter (e.g., district when no province selected)
};

// Search filter configuration - Static filter
export const SearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

// Status filter configuration - Static filter
export const StatusFilter: FilterConfig = {
  nameKey: 'admin.filters.status',
  attr: 'status',
  type: 'select',
  data: [
    { labelKey: 'admin.filters.allStatus', value: 'all-status' },
    { labelKey: 'admin.filters.active', value: 'Active' },
    { labelKey: 'admin.filters.deactivated', value: 'Deactivated' },
  ],
};

/**
 * Map filter status labels to API status format
 * Maps display labels to API format (e.g., "Active" → "ACTIVE")
 */
export const mapStatusLabelToAPI = (statusLabel: string): string => {
  const statusMap: Record<string, string> = {
    'Active': 'ACTIVE',
    'Deactivated': 'INACTIVE',
  };
  return statusMap[statusLabel] || statusLabel;
};

/**
 * Custom hook to manage user management filters with API integration
 * Fetches roles and provinces from API and builds filter options dynamically
 */
export const useUserManagementFilters = (filters: Record<string, any>) => {
  // State for API data
  const [roles, setRoles] = useState<Role[]>([]);
  const [provinces, setProvinces] = useState<ProvinceEntity[]>([]);
  const [sites, setSites] = useState<SiteEntity[]>([]);

  // Fetch roles and provinces from API on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch roles
      try {
        const rolesResponse = await getRolesList({ page: 1, limit: 100 });
        const allRoles = rolesResponse.result?.data || [];
        // Filter only ACTIVE roles for the dropdown
        const activeRoles = allRoles.filter((role: Role) => role.status === 'ACTIVE');
        setRoles(activeRoles);
      } catch (error) {
        setRoles([]);
      }

      // Fetch provinces
      try {
        // First, check if entity types are in storage
        let entityTypes = await getEntityTypesFromStorage();
        
        // If not in storage, fetch entity types from API
        if (!entityTypes || !entityTypes['province']) {
          await getEntityTypesList();
          entityTypes = await getEntityTypesFromStorage();
        }

        // Get province entity type ID
        const provinceEntityTypeId = entityTypes?.['province'];
        
        if (!provinceEntityTypeId) {
          setProvinces([]);
          return;
        }

        // Fetch provinces using the entity type ID
        const provincesResponse = await getProvincesByEntityType(provinceEntityTypeId);
        const provincesData = provincesResponse.result || [];
        setProvinces(provincesData);
      } catch (error) {
        setProvinces([]);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch sites when province filter changes
  useEffect(() => {
    const fetchSites = async () => {
      const selectedProvince = filters.province;
      
      // Only fetch sites if a specific province is selected (not "all-provinces")
      if (!selectedProvince || selectedProvince === 'all-provinces') {
        setSites([]);
        return;
      }

      try {
        // Fetch sites for the selected province
        const sitesResponse = await getSitesByProvince(selectedProvince, {
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
  }, [filters.province]); // Re-fetch when province filter changes

  // Build dynamic filter options with API data
  const filterOptions = useMemo(() => {
    // Build role filter from API roles
    const roleFilterOptions = [
      { labelKey: 'admin.filters.allRoles', value: 'all-roles' },
      ...roles.map((role: Role) => ({
        label: role.label, // Display label in dropdown
        value: role.title, // Use title as value for filtering (unique identifier)
      })),
    ];

    // Build province filter from API provinces
    const provinceFilterOptions = [
      { labelKey: 'admin.filters.allProvinces', value: 'all-provinces' },
      ...provinces.map((province: ProvinceEntity) => ({
        label: province.name,
        value: province._id,
      })),
    ];

    // Determine if site filter should be disabled
    const selectedProvince = filters.province;
    const isProvinceSelected = selectedProvince &&
                               selectedProvince !== 'all-provinces';
    const shouldDisableSiteFilter = !isProvinceSelected; // Disable until a province is selected

    // Build site filter from API sites
    const siteFilterOptions = [
      { labelKey: 'admin.filters.allSites', value: 'all-sites' },
      ...sites.map((site: SiteEntity) => ({
        label: site.name,
        value: site._id, // Use _id as value for filtering
      })),
    ];

    return [
      {
        nameKey: 'common.search',
        attr: 'search',
        type: 'search' as const,
        data: [],
        placeholderKey: 'admin.filters.searchPlaceholder',
      },
      {
        nameKey: 'admin.filters.role',
        attr: 'role',
        type: 'select' as const,
        data: roleFilterOptions,
      },
      {
        nameKey: 'admin.filters.status',
        attr: 'status',
        type: 'select' as const,
        data: [
          { labelKey: 'admin.filters.allStatus', value: 'all-status' },
          { labelKey: 'admin.filters.active', value: 'Active' },
          { labelKey: 'admin.filters.deactivated', value: 'Deactivated' },
        ],
      },
      {
        nameKey: 'admin.filters.province',
        attr: 'province',
        type: 'select' as const,
        data: provinceFilterOptions,
      },
      {
        nameKey: 'admin.filters.site',
        attr: 'site',
        type: 'select' as const,
        data: siteFilterOptions,
        disabled: shouldDisableSiteFilter, // Disable until province is selected
      },
    ];
  }, [roles, provinces, sites, filters.province]);

  return {
    filters: filterOptions,
    roles,
    provinces,
    sites,
  };
};

export const supervisorFilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.filterByProvince',
    attr: 'filterByProvince',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allProvinces', value: 'all-Provinces' },
      { labelKey: 'Gauteng', value: 'Gauteng' },
      { labelKey: 'KwaZulu-nutal', value: 'KwaZulu-nutal' },
      { labelKey: 'Western Cape', value: 'Western Cape' },
    ],
  },
  {
    nameKey: 'admin.filters.selectSupervisor',
    attr: 'selectSupervisor',
    type: 'select',
    placeholderKey: 'admin.filters.chooseSupervisor',
    data: [
      {
        labelKey: 'Dr. Lerato Mokoena',
        value: 'Dr. Lerato Mokoena',
      },
      {
        labelKey: 'Zanele Ndabae',
        value: 'Zanele Ndabae',
      },
      {
        labelKey: 'Mpho Sithole',
        value: 'Mpho Sithole',
      }
    ],
  },
 ];
 
 
 export const lcFilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.site',
    attr: 'site',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allSites', value: 'all-sites' },
      { label: 'KwaMashu', value: 'KwaMashu' },
      { label: 'KwaMashu2', value: 'KwaMashu2' },
      { label: 'KwaMashu3', value: 'KwaMashu3' },
      { label: 'KwaMashu4', value: 'KwaMashu4' },
      { label: 'Mthwalume', value: 'Mthwalume' },
      { label: 'Mthwalume2', value: 'Mthwalume2' },
      { label: 'Mthwalume3', value: 'Mthwalume3' },
      { label: 'Madadeni', value: 'Madadeni' },
      { label: 'Madadeni2', value: 'Madadeni2' },
      { label: 'Madadeni3', value: 'Madadeni3' },
      { label: 'Madadeni4', value: 'Madadeni4' },
      { label: 'Oppermans', value: 'Oppermans' },
      { label: 'Oppermans2', value: 'Oppermans2' },
      { label: 'Meloding', value: 'Meloding' },
      { label: 'Meloding2', value: 'Meloding2' },
      { label: 'Randfontein', value: 'Randfontein' },
      { label: 'Randfontein2', value: 'Randfontein2' },
      { label: 'Sebokeng', value: 'Sebokeng' },
    ],
  },
 ];
 
 
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
 
