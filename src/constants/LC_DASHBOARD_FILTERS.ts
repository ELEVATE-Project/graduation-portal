/**
 * LC Dashboard Filter Configurations
 * Data-driven filter definitions for the LC dashboard screen (URL-only: /lc-dashboard)
 */
type FilterConfig = {
  name?: string;
  nameKey?: string;
  attr: string;
  type?: string;
  data?: any[];
  placeholder?: string;
  placeholderKey?: string;
  [key: string]: any;
};

export const LcTimePeriodFilter: FilterConfig = {
  nameKey: 'admin.dashboardFilters.timePeriod',
  attr: 'timePeriod',
  type: 'select',
  data: [
    { labelKey: 'admin.filters.allTimePeriod', value: 'all-time' },
    { labelKey: 'admin.dashboardFilters.last6Months', value: 'last-6-months' },
    { labelKey: 'admin.dashboardFilters.last3Months', value: 'last-3-months' },
    { labelKey: 'admin.dashboardFilters.lastMonth', value: 'last-month' },
    { labelKey: 'admin.dashboardFilters.lastWeek', value: 'last-week' },
  ],
};

export const LcProvincesFilter: FilterConfig = {
  nameKey: 'admin.filters.filterByProvince',
  attr: 'province',
  type: 'select',
  data: [
    { labelKey: 'admin.filters.allProvinces', value: 'all-provinces' },
    { labelKey: 'Gauteng', value: 'Gauteng' },
    { labelKey: 'KwaZulu-nutal', value: 'KwaZulu-nutal' },
    { labelKey: 'Western Cape', value: 'Western Cape' },
  ],
};

export const LcSitesFilter: FilterConfig = {
  nameKey: 'admin.filters.site',
  attr: 'site',
  type: 'select',
  data: [
    { labelKey: 'admin.filters.allSites', value: 'all-sites' },
    { labelKey: 'Site A', value: 'Site A' },
    { labelKey: 'Site B', value: 'Site B' },
  ],
};

export const LcGendersFilter: FilterConfig = {
  nameKey: 'admin.dashboardFilters.genders',
  attr: 'gender',
  type: 'select',
  data: [
    { labelKey: 'admin.dashboardFilters.allGenders', value: 'all-genders' },
    { labelKey: 'admin.dashboardFilters.male', value: 'male' },
    { labelKey: 'admin.dashboardFilters.female', value: 'female' },
    { labelKey: 'admin.dashboardFilters.other', value: 'other' },
  ],
};

export const LcDashboardFilterOptions: ReadonlyArray<FilterConfig> = [
  LcTimePeriodFilter,
  LcProvincesFilter,
  LcSitesFilter,
  LcGendersFilter,
];

