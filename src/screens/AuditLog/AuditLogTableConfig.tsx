import React from 'react';
import { HStack, Text, Box } from '@ui';
import { ColumnDef } from '@app-types/components';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { LucideIcon } from '@ui/index';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';
import { AuditLogEntry } from '@constants/AUDIT_LOG_MOCK_DATA';

/**
 * Get action icon based on action type
 */
const getActionIcon = (actionType: string): string => {
  const iconMap: Record<string, string> = {
    'user-import': 'Upload',
    'password-reset': 'RefreshCw',
    'template-creation': 'FileText',
    'user-creation': 'UserPlus',
    'system-configuration': 'Settings',
    'data-view': 'Eye',
    'template-activation': 'FileCheck',
  };
  return iconMap[actionType] || 'Activity';
};

/**
 * Get role badge color based on role
 */
const getRoleBadgeColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    'Administrator': theme.tokens.colors.error600,
    'Supervisor': theme.tokens.colors.primary500,
    'Learning Coach': theme.tokens.colors.textSecondary,
  };
  return colorMap[role] || theme.tokens.colors.gray600;
};

/**
 * Role Badge Component
 */
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const bgColor = getRoleBadgeColor(role);
  
  return (
    <Box
      bg={bgColor}
      px="$2"
      py="$1"
      borderRadius="$md"
      alignSelf="flex-start"
    >
      <Text
        {...TYPOGRAPHY.bodySmall}
        color="$white"
        fontSize="$xs"
        fontWeight="$medium"
      >
        {role}
      </Text>
    </Box>
  );
};

/**
 * Action Column Component with Icon
 */
const ActionColumn: React.FC<{ entry: AuditLogEntry }> = ({ entry }) => {
  const iconName = getActionIcon(entry.actionType);
  
  return (
    <HStack space="sm" alignItems="center">
      <LucideIcon
        name={iconName}
        size={16}
        color={theme.tokens.colors.textMutedForeground}
      />
      <Text
        {...TYPOGRAPHY.paragraph}
        color="$textForeground"
        fontSize="$sm"
      >
        {entry.action}
      </Text>
    </HStack>
  );
};

/**
 * All columns for Audit Log Table
 */
export const getAuditLogColumns = (): ColumnDef<AuditLogEntry>[] => [
  {
    key: 'timestamp',
    label: 'admin.auditLog.table.timestamp',
    flex: 1.5,
    render: entry => (
      <Text
        {...TYPOGRAPHY.paragraph}
        color="$textMutedForeground"
        fontSize="$sm"
      >
        {entry.timestamp}
      </Text>
    ),
    mobileConfig: {
      leftRank: 1,
      showLabel: true,
    },
  },
  {
    key: 'action',
    label: 'admin.auditLog.table.action',
    flex: 1.5,
    render: entry => <ActionColumn entry={entry} />,
    mobileConfig: {
      leftRank: 2,
      showLabel: true,
    },
  },
  {
    key: 'user',
    label: 'admin.auditLog.table.user',
    flex: 1.5,
    render: entry => (
      <Text
        {...TYPOGRAPHY.paragraph}
        color="$textForeground"
        fontSize="$sm"
      >
        {entry.user}
      </Text>
    ),
    mobileConfig: {
      leftRank: 3,
      showLabel: true,
    },
  },
  {
    key: 'role',
    label: 'admin.auditLog.table.role',
    flex: 1.2,
    render: entry => <RoleBadge role={entry.role} />,
    mobileConfig: {
      rightRank: 1,
      showLabel: true,
    },
  },
  {
    key: 'targetId',
    label: 'admin.auditLog.table.targetId',
    flex: 1.2,
    render: entry => (
      <Text
        {...TYPOGRAPHY.paragraph}
        color="$textMutedForeground"
        fontSize="$sm"
      >
        {entry.targetId}
      </Text>
    ),
    mobileConfig: {
      leftRank: 4,
      showLabel: true,
    },
  },
  {
    key: 'changeSummary',
    label: 'admin.auditLog.table.changeSummary',
    flex: 2.5,
    render: entry => (
      <Text
        {...TYPOGRAPHY.paragraph}
        color="$textMutedForeground"
        fontSize="$sm"
      >
        {entry.changeSummary}
      </Text>
    ),
    mobileConfig: {
      fullWidthRank: 1,
      showLabel: true,
    },
  },
];

