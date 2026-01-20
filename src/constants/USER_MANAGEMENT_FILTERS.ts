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
  data: Array<
    string | { label?: string; labelKey?: string; value: string | null }
  >;
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
