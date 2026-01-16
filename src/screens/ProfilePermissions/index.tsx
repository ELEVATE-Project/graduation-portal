import React from 'react';
import { ScrollView } from 'react-native';
import { styles } from './Styles';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    LucideIcon,
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';

const ProfilePermissions = () => {
    const { t } = useLanguage();

    // Type definition for permissions
    type PermissionType = 'edit' | 'view';
    type ApprovalType = 'supervisor' | 'siteDataChange' | null;

    interface ProfileField {
        field: string;
        admin: PermissionType;
        supervisor: PermissionType;
        lc: PermissionType;
        participant: PermissionType;
        approval: ApprovalType;
    }

    // Static permissions data
    const PROFILE_FIELDS: ProfileField[] = [
        { field: 'firstName', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'edit', approval: null },
        { field: 'lastName', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'edit', approval: null },
        { field: 'email', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'view', approval: null },
        { field: 'idNumber', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'view', approval: null },
        { field: 'phoneNumber', admin: 'edit', supervisor: 'edit', lc: 'edit', participant: 'edit', approval: null },
        { field: 'role', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'view', approval: null },
        { field: 'province', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'view', approval: null },
        { field: 'district', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'view', approval: null },
        { field: 'siteLocation', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'view', approval: 'supervisor' },
        { field: 'address', admin: 'edit', supervisor: 'edit', lc: 'edit', participant: 'edit', approval: 'siteDataChange' },
        { field: 'assignedSupervisor', admin: 'edit', supervisor: 'edit', lc: 'view', participant: 'view', approval: null },
        { field: 'assignedLC', admin: 'edit', supervisor: 'edit', lc: 'view', participant: 'view', approval: null },
        { field: 'status', admin: 'edit', supervisor: 'view', lc: 'view', participant: 'view', approval: null },
        { field: 'password', admin: 'edit', supervisor: 'edit', lc: 'view', participant: 'edit', approval: null },
    ];

    const renderPermissionIcon = (permission: 'edit' | 'view') => {
        if (permission === 'edit') {
            return <LucideIcon name="Pencil" size={16} color={theme.tokens.colors.success600} />;
        }
        return <LucideIcon name="Eye" size={16} color={theme.tokens.colors.textSecondary} />;
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <VStack style={styles.headerContainer}>
                <HStack space="sm" style={styles.headerTitleRow}>
                    <Box style={styles.headerIconWrapper}>
                        <LucideIcon name="ShieldCheck" size={28} color={theme.tokens.colors.primary500} />
                    </Box>
                    <Heading size="xl" style={styles.headerTitleText}>{t('admin.profilePermissionsPage.pageTitle')}</Heading>
                </HStack>
                <Text size="md" color="$textSecondary" style={styles.headerSubtitleText}>{t('admin.profilePermissionsPage.pageSubtitle')}</Text>
            </VStack>

            {/* Permissions Table - Single Container */}
            <Box style={[styles.tableContainer, { marginHorizontal: 16 }]}>
                {/* Info Alert - Inside Table */}
                <Box style={styles.tableInfoAlert}>
                    <HStack space="sm" alignItems="flex-start">
                        <LucideIcon name="Info" size={20} color={theme.tokens.colors.textSecondary} />
                        <Text fontSize={14} color="$textPrimary" style={{ flex: 1 }}>
                            {t('admin.profilePermissionsPage.infoAlert')}
                        </Text>
                    </HStack>
                </Box>

                {/* Scrollable Table Content */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
                    style={{ marginHorizontal: -16, marginBottom: 0 }}
                >
                    <Box style={{ minWidth: 760, flex: 1 }}>
                        {/* Table Header */}
                        <Box style={styles.tableHeader}>
                            <Box style={styles.fieldNameCell}>
                                <Text fontSize={13} fontWeight="600" color="$textPrimary">
                                    {t('admin.profilePermissionsPage.tableHeaders.profileField')}
                                </Text>
                            </Box>

                            {/* Admin Column */}
                            <Box style={styles.headerCell}>
                                <Box style={[styles.roleBadge, { backgroundColor: theme.tokens.colors.error900 }]}>
                                    <Text style={styles.roleBadgeText}>{t('admin.profilePermissionsPage.tableHeaders.admin')}</Text>
                                </Box>
                                <Text style={styles.roleSubtitle}>{t('admin.profilePermissionsPage.tableHeaders.adminSubtitle')}</Text>
                            </Box>

                            {/* Supervisor Column */}
                            <Box style={styles.headerCell}>
                                <Box style={[styles.roleBadge, { backgroundColor: theme.tokens.colors.error600 }]}>
                                    <Text style={styles.roleBadgeText}>{t('admin.profilePermissionsPage.tableHeaders.supervisor')}</Text>
                                </Box>
                                <Text style={styles.roleSubtitle}>{t('admin.profilePermissionsPage.tableHeaders.supervisorSubtitle')}</Text>
                            </Box>

                            {/* LC Column */}
                            <Box style={styles.headerCell}>
                                <Box style={[styles.roleBadge, { backgroundColor: theme.tokens.colors.gray600 }]}>
                                    <Text style={styles.roleBadgeText}>{t('admin.profilePermissionsPage.tableHeaders.lc')}</Text>
                                </Box>
                                <Text style={styles.roleSubtitle}>{t('admin.profilePermissionsPage.tableHeaders.lcSubtitle')}</Text>
                            </Box>

                            {/* Participant Column */}
                            <Box style={styles.headerCell}>
                                <Text fontSize={13} fontWeight="600" color="$textPrimary">
                                    {t('admin.profilePermissionsPage.tableHeaders.participant')}
                                </Text>
                                <Text style={styles.roleSubtitle}>{t('admin.profilePermissionsPage.tableHeaders.participantSubtitle')}</Text>
                            </Box>

                            {/* Approval Required Column */}
                            <Box style={styles.headerCell}>
                                <Text fontSize={13} fontWeight="600" color="$textPrimary">
                                    {t('admin.profilePermissionsPage.tableHeaders.approvalRequired')}
                                </Text>
                            </Box>
                        </Box>

                        {/* Table Rows */}
                        {PROFILE_FIELDS.map((field, index) => (
                            <Box key={field.field} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                                <Box style={styles.fieldNameCell}>
                                    <Text style={styles.fieldNameText}>
                                        {t(`admin.profilePermissionsPage.fields.${field.field}`)}
                                    </Text>
                                </Box>

                                <Box style={styles.iconCell}>{renderPermissionIcon(field.admin)}</Box>
                                <Box style={styles.iconCell}>{renderPermissionIcon(field.supervisor)}</Box>
                                <Box style={styles.iconCell}>{renderPermissionIcon(field.lc)}</Box>
                                <Box style={styles.iconCell}>{renderPermissionIcon(field.participant)}</Box>

                                <Box style={styles.iconCell}>
                                    {field.approval ? (
                                        <Box style={styles.approvalBadge}>
                                            <Text style={styles.approvalBadgeText}>
                                                {t(`admin.profilePermissionsPage.approvalBadges.${field.approval}`)}
                                            </Text>
                                        </Box>
                                    ) : (
                                        <Text style={{ fontSize: 14, color: theme.tokens.colors.textSecondary }}>—</Text>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </ScrollView>

                {/* Legend and Key Rules - Inside Same Container */}
                <Box style={styles.legendInsideContainer}>
                    <HStack space="lg" alignItems="flex-start">
                        {/* Legend */}
                        <VStack style={{ flex: 1 }}>
                            <HStack space="sm" alignItems="center" style={{ marginBottom: 12 }}>
                                <LucideIcon name="Info" size={20} color={theme.tokens.colors.textPrimary} />
                                <Text style={styles.legendTitle}>{t('admin.profilePermissionsPage.legend.title')}</Text>
                            </HStack>
                            <VStack space="xs">
                                <HStack style={styles.legendItem}>
                                    <LucideIcon name="Pencil" size={16} color={theme.tokens.colors.success600} />
                                    <Text style={styles.legendText}>{t('admin.profilePermissionsPage.legend.canEdit')}</Text>
                                </HStack>
                                <HStack style={styles.legendItem}>
                                    <LucideIcon name="Eye" size={16} color={theme.tokens.colors.textSecondary} />
                                    <Text style={styles.legendText}>{t('admin.profilePermissionsPage.legend.viewOnly')}</Text>
                                </HStack>
                            </VStack>
                        </VStack>

                        {/* Key Rules */}
                        <VStack style={{ flex: 1 }}>
                            <HStack space="sm" alignItems="center" style={{ marginBottom: 12 }}>
                                <LucideIcon name="Key" size={20} color={theme.tokens.colors.textPrimary} />
                                <Text style={styles.legendTitle}>{t('admin.profilePermissionsPage.keyRules.title')}</Text>
                            </HStack>
                            <VStack space="xs">
                                <HStack style={styles.ruleItem}>
                                    <Box style={styles.ruleBullet} />
                                    <Text style={styles.ruleText}>{t('admin.profilePermissionsPage.keyRules.rule1')}</Text>
                                </HStack>
                                <HStack style={styles.ruleItem}>
                                    <Box style={styles.ruleBullet} />
                                    <Text style={styles.ruleText}>{t('admin.profilePermissionsPage.keyRules.rule2')}</Text>
                                </HStack>
                                <HStack style={styles.ruleItem}>
                                    <Box style={styles.ruleBullet} />
                                    <Text style={styles.ruleText}>{t('admin.profilePermissionsPage.keyRules.rule3')}</Text>
                                </HStack>
                                <HStack style={styles.ruleItem}>
                                    <Box style={styles.ruleBullet} />
                                    <Text style={styles.ruleText}>{t('admin.profilePermissionsPage.keyRules.rule4')}</Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </HStack>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default ProfilePermissions;
