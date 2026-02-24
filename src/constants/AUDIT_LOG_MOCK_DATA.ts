/**
 * Audit Log Mock Data
 * Sample data for the Audit Log table
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string; // Format: "2024-03-15 14:30:22"
  action: string; // Action type: "User Import", "Password Reset", etc.
  actionType: string; // For filtering: "user-import", "password-reset", etc.
  user: string; // User name
  role: string; // User role: "Administrator", "Supervisor", "Learning Coach", "Participant"
  targetId: string; // Target identifier: "IMP-2024-001", "USR-789123", etc.
  changeSummary: string; // Description of the action
}

export const AUDIT_LOG_MOCK_DATA: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: '2024-03-15 14:30:22',
    action: 'User Import',
    actionType: 'user-import',
    user: 'Admin User',
    role: 'Administrator',
    targetId: 'IMP-2024-001',
    changeSummary: 'Imported 150 participant records',
  },
  {
    id: '2',
    timestamp: '2024-03-15 13:45:10',
    action: 'Password Reset',
    actionType: 'password-reset',
    user: 'LC-Thabo.Mthembu',
    role: 'Learning Coach',
    targetId: 'USR-789123',
    changeSummary: 'Reset password for participant Mandla Zwane',
  },
  {
    id: '3',
    timestamp: '2024-03-15 12:20:05',
    action: 'Template Creation',
    actionType: 'template-creation',
    user: 'Admin User',
    role: 'Administrator',
    targetId: 'TPL-456789',
    changeSummary: "Created a new IDP template 'Leadership Development'",
  },
  {
    id: '4',
    timestamp: '2024-03-15 11:15:33',
    action: 'User Creation',
    actionType: 'user-creation',
    user: 'Dr. Lerato Mokoena',
    role: 'Supervisor',
    targetId: 'USR-456123',
    changeSummary: 'Created a new Learning Coach account for Sipho Khumalo',
  },
  {
    id: '5',
    timestamp: '2024-03-15 10:05:18',
    action: 'System Configuration',
    actionType: 'system-configuration',
    user: 'Admin User',
    role: 'Administrator',
    targetId: 'CFG-001',
    changeSummary: 'Updated password policy settings',
  },
  {
    id: '6',
    timestamp: '2024-03-15 09:30:45',
    action: 'Data View',
    actionType: 'data-view',
    user: 'Zanele Ndaba',
    role: 'Supervisor',
    targetId: 'RPT-2024-003',
    changeSummary: 'Viewed a participant progress report',
  },
  {
    id: '7',
    timestamp: '2024-03-14 16:20:12',
    action: 'User Import',
    actionType: 'user-import',
    user: 'Admin User',
    role: 'Administrator',
    targetId: 'IMP-2024-002',
    changeSummary: 'Failed import: 5 records with validation errors',
  },
  {
    id: '8',
    timestamp: '2024-03-14 15:10:30',
    action: 'Template Activation',
    actionType: 'template-activation',
    user: 'Admin User',
    role: 'Administrator',
    targetId: 'TPL-456789',
    changeSummary: "Activated template 'Sales Skills Enhancement'",
  },
];

