/**
 * User Management Filter Configurations
 * Data-driven filter definitions for the User Management screen
 */

// Type definition for filter configuration
type FilterConfig = {
  name?: string; // Fallback if nameKey is not provided
  nameKey?: string; // Translation key for the filter name
  attr: string;
  type: 'search' | 'select';
  data: Array<string | { label?: string; labelKey?: string; value: string | null }>;
  placeholder?: string; // Fallback if placeholderKey is not provided
  placeholderKey?: string; // Translation key for the placeholder
};

// Search filter configuration
export const SearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

// Search filter for participants
export const ParticipantSearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchParticipantsPlaceholder',
};

// Select filters (Role, Status, etc.)
export const FilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.role',
    attr: 'role',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allRoles', value: 'all-roles' },
      { labelKey: 'admin.filters.admin', value: 'Admin' },
      { labelKey: 'admin.filters.supervisor', value: 'Supervisor' },
      { labelKey: 'admin.filters.linkageChampion', value: 'Linkage Champion' },
      { labelKey: 'admin.filters.participant', value: 'Participant' },
    ],
  },
  {
    nameKey: 'admin.filters.status',
    attr: 'status',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allStatus', value: 'all-status' },
      { labelKey: 'admin.filters.active', value: 'Active' },
      { labelKey: 'admin.filters.deactivated', value: 'Deactivated' },
    ],
  },
];

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
 
