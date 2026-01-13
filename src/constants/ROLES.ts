/**
 * Role constants for user role-based access control.
 * Used to determine user permissions and navigation access.
 */
export const ADMIN_ROLES: readonly string[] = [
  'admin',
  'tenant_admin',
] as const;
export const LC_ROLES: readonly string[] = [
  'lc',
  'session_manager',
  'org_admin',
] as const;

export const ROLE_NAMES = {
  ADMIN: 'Admin',
  LC: 'LC',
  SESSION_MANAGER: 'Session Manager',
  ORG_ADMIN: 'Organization Admin',
  PARTICIPANT: 'Participant',
  USER: 'user',
};
