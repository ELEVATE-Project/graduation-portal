import { StyleSheet } from 'react-native';
import { theme } from '@config/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: theme.tokens.colors.white,
    },
    headerContainer: {
        marginBottom: 24,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
    headerTitleRow: {
        alignItems: 'flex-start',
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingTop: 4,
    },
    headerIconWrapper: {
        marginTop: 4,
    },
    headerTitleText: {
        flex: 1,
    },
    headerSubtitleText: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    tableInfoAlert: {
        backgroundColor: theme.tokens.colors.white,
        borderWidth: 1,
        borderColor: theme.tokens.colors.gray300,
        padding: 16,
        marginBottom: 16,
        borderRadius: 4,
    },
    tableContainer: {
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: theme.tokens.colors.gray300,
        borderRadius: 8,
        marginBottom: 32,
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: theme.tokens.colors.gray50,
        borderBottomWidth: 2,
        borderBottomColor: theme.tokens.colors.gray300,
        paddingVertical: 12,
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    headerCell: {
        flex: 1,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldNameCell: {
        flex: 1.5,
        minWidth: 160,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 4,
    },
    roleBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.tokens.colors.white,
        textAlign: 'center',
    },
    roleSubtitle: {
        fontSize: 11,
        color: theme.tokens.colors.textSecondary,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.tokens.colors.gray300,
        paddingVertical: 12,
        marginHorizontal: -16,
        paddingHorizontal: 16,
        backgroundColor: theme.tokens.colors.white,
    },
    tableRowAlt: {
        backgroundColor: theme.tokens.colors.gray50,
    },
    fieldNameText: {
        fontSize: 14,
        color: theme.tokens.colors.textPrimary,
        fontWeight: '500',
    },
    iconCell: {
        flex: 1,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    approvalBadge: {
        backgroundColor: theme.tokens.colors.warning500,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    approvalBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.tokens.colors.white,
    },
    legendInsideContainer: {
        paddingTop: 24,
        paddingBottom: 16,
        marginTop: 8,
    },
    legendSection: {
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
        marginBottom: 32,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.tokens.colors.textPrimary,
        marginBottom: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    legendText: {
        fontSize: 14,
        color: theme.tokens.colors.textSecondary,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 8,
    },
    ruleBullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.tokens.colors.textSecondary,
        marginTop: 6,
    },
    ruleText: {
        flex: 1,
        fontSize: 14,
        color: theme.tokens.colors.textSecondary,
    },
});
