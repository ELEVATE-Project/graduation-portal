import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

// Base column text style - common properties shared by all column text styles
const columnTextBase = {
  fontWeight: '$normal' as const,
  fontSize: '$sm' as const,
};

export const templateManagementStyles = {
    infoBox: {
        borderWidth: 1,
        borderColor: '$borderLight200',
        bg: '$white',
        borderRadius: '$lg',
        paddingVertical: '$3',
        paddingHorizontal: '$4',
        mt: '$6',
    },
    infoBoxTitle: {
        fontWeight: '$medium',
        fontSize: '$sm',
        color: '$textForeground',
    },
    infoBoxDescription: {
        fontWeight: '$normal',
        fontSize: '$sm',
        color: '$textMutedForeground',
    },
    tableContainer: {
        bg: '$white' as const,
        padding: '$6' as const,
        borderRadius: '$xl' as const,
        borderWidth: 1,
        borderColor: '$borderColor' as const,
        mt: '$6',
    },
    tableHeaderContainer: {
        mb: '$6',
    },
    tableHeaderTitle: {
        fontWeight: '$normal',
        fontSize: '$lg',
        color: '$textForeground',
    },
    // Status Badge Styles
    statusBadge: {
        paddingHorizontal: '$2' as const,
        paddingVertical: '$0.5' as const,
        borderRadius: '$md' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    statusBadgeText: {
        color: '$white' as const,
        fontWeight: '$medium' as const,
        fontSize: '$xs' as const,
    },
    statusBadgeActive: {
        bg: '$success600' as const,
    },
    statusBadgeInactive: {
        bg: '$textMutedForeground' as const,
    },
    // Column Text Styles - using base style with color overrides
    templateNameText: {
        ...columnTextBase,
        color: '$textForeground' as const,
    },
    uploadedViaText: {
        ...columnTextBase,
        color: '$textMutedForeground' as const,
        fontSize: '$xs' as const,
    },
    creatorText: {
        ...columnTextBase,
        color: '$textForeground' as const,
    },
    tasksText: {
        ...columnTextBase,
        color: '$textForeground' as const,
    },
    createdDateText: {
        ...columnTextBase,
        color: '$textForeground' as const,
    },
    // CSV Upload Guide Styles
    csvGuideContainer: {
        bg: '$white' as const,
        borderWidth: 1,
        borderColor: '$borderLight200' as const,
        borderRadius: '$lg' as const,
        padding: '$6' as const,
        mt: '$6',
    },
    csvGuideTitle: {
        color: '$textForeground' as const,
        fontWeight: '$normal' as const,
        fontSize: '$md' as const,
    },
    csvGuideSectionTitle: {
        color: '$textForeground' as const,
        fontWeight: '$normal' as const,
        fontSize: '$md' as const,
    },
    csvGuideBullet: {
        color: '$textForeground' as const,
        fontSize: '$md' as const,
        fontWeight: '$normal' as const,
        mt: '$1',
    },
    csvGuideColumnName: {
        fontSize: '$xs' as const,
        color: '$textMutedForeground' as const,
        fontWeight: '$normal' as const,
        bg:'$bgSidebar',
        borderRadius: '$sm' as const,
        px: '$1',
        py: '$0.5',
    },
    csvGuideColumnDescription: {
        fontSize: '$xs' as const,
        color: '$textMutedForeground' as const,
        fontWeight: '$normal' as const,
    },
    csvGuideStepNumber: {
        width: '$6',
        height: '$6',
        borderRadius: '$full' as const,
        bg: '$primary500' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
    },
    csvGuideStepNumberText: {
        color: '$white' as const,
        fontWeight: '$medium' as const,
        fontSize: '$xs' as const,
    },
    csvGuideStepText: {
        fontSize: '$xs' as const,
        fontWeight: '$normal' as const,
        color: '$textMutedForeground' as const,
    },
} as const;