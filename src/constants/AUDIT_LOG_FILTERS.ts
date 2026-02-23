/**
 * Audit Log Filter Configurations
 * Data-driven filter definitions for the Audit Log screen
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

// Action Type filter
export const ActionTypeFilter: FilterConfig = {
  nameKey: 'admin.auditLog.filters.actionType',
  attr: 'actionType',
  type: 'select',
  data: [
    { labelKey: 'admin.auditLog.filters.allActions', value: 'all-actions' },
    { labelKey: 'admin.auditLog.filters.userImport', value: 'user-import' },
    { labelKey: 'admin.auditLog.filters.passwordReset', value: 'password-reset' },
    { labelKey: 'admin.auditLog.filters.templateCreation', value: 'template-creation' },
    { labelKey: 'admin.auditLog.filters.userCreation', value: 'user-creation' },
    { labelKey: 'admin.auditLog.filters.systemConfiguration', value: 'system-configuration' },
    { labelKey: 'admin.auditLog.filters.dataView', value: 'data-view' },
    { labelKey: 'admin.auditLog.filters.templateActivation', value: 'template-activation' },
  ],
};

// User Role filter
export const UserRoleFilter: FilterConfig = {
  nameKey: 'admin.auditLog.filters.userRole',
  attr: 'userRole',
  type: 'select',
  data: [
    { labelKey: 'admin.auditLog.filters.allRoles', value: 'all-roles' },
    { labelKey: 'admin.auditLog.filters.administrator', value: 'Administrator' },
    { labelKey: 'admin.auditLog.filters.supervisor', value: 'Supervisor' },
    { labelKey: 'admin.auditLog.filters.learningCoach', value: 'Learning Coach' },
    { labelKey: 'admin.auditLog.filters.participant', value: 'Participant' },
  ],
};

// Date From filter
export const DateFromFilter: FilterConfig = {
  nameKey: 'admin.auditLog.filters.dateFrom',
  attr: 'dateFrom',
  type: 'search',
  data: [],
  placeholderKey: 'admin.auditLog.filters.datePlaceholder',
};

// Date To filter
export const DateToFilter: FilterConfig = {
  nameKey: 'admin.auditLog.filters.dateTo',
  attr: 'dateTo',
  type: 'search',
  data: [],
  placeholderKey: 'admin.auditLog.filters.datePlaceholder',
};

// All filter options
export const AuditLogFilterOptions: ReadonlyArray<FilterConfig> = [
  ActionTypeFilter,
  UserRoleFilter,
  DateFromFilter,
  DateToFilter,
];

