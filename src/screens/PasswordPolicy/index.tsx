import React from 'react';
import { ScrollView } from 'react-native';
import { passwordPolicyStyles } from './Styles';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    LucideIcon,
    Container,
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';
import { HIERARCHY_KEYS, REQUIREMENTS_KEYS } from '@constants/PASSWORD_POLICY_DATA';

const PasswordPolicy = () => {
    const { t } = useLanguage();

    // Reconstruct Data with Translations
    const HIERARCHY_DATA = HIERARCHY_KEYS.map(keyData => ({
        id: keyData.id,
        title: t(keyData.badgeKey),
        badgeText: t(keyData.titleKey),
        badgeColor: keyData.badgeColor,
        sections: keyData.sections.map(section => ({
            type: section.type,
            title: t(section.titleKey),
            items: (t(section.itemsKey, { returnObjects: true }) as unknown) as string[],
            icon: (section as any).icon
        })),
        note: keyData.noteKey ? t(keyData.noteKey) : undefined
    }));

    const REQUIREMENTS_DATA = {
        strength: {
            title: t(REQUIREMENTS_KEYS.strength.titleKey),
            items: (t(REQUIREMENTS_KEYS.strength.itemsKey, { returnObjects: true }) as unknown) as string[]
        },
        process: {
            title: t(REQUIREMENTS_KEYS.process.titleKey),
            items: (t(REQUIREMENTS_KEYS.process.itemsKey, { returnObjects: true }) as unknown) as string[]
        }
    };

    const renderPermissionBlock = (section: any) => {
        const isSuccess = section.type === 'success';
        const bgColor = isSuccess ? '$success50' : '$error50';
        const borderColor = isSuccess ? '$success300' : '$error200';
        // LucideIcon needs hex color
        const iconColor = isSuccess ? theme.tokens.colors.success600 : theme.tokens.colors.error600;
        const iconName = section.icon || (isSuccess ? 'RefreshCw' : 'AlertCircle');

        return (
            <Box
                {...passwordPolicyStyles.permissionBlock as any}
                bg={bgColor}
                borderColor={borderColor}
            >
                <Box {...passwordPolicyStyles.permissionHeader}>
                    <LucideIcon name={iconName} size={16} color={iconColor} />
                    <Text {...passwordPolicyStyles.permissionTitle}>{section.title}</Text>
                </Box>
                <VStack {...passwordPolicyStyles.listContainer}>
                    {section.items.map((item: string, idx: number) => (
                        <HStack key={idx} {...passwordPolicyStyles.listItem}>
                            <Box {...passwordPolicyStyles.bullet} bg={iconColor} />
                            <Text {...passwordPolicyStyles.listItemText}>{item}</Text>
                        </HStack>
                    ))}
                </VStack>
            </Box>
        );
    };

    return (
        <ScrollView {...passwordPolicyStyles.container} showsVerticalScrollIndicator={false}>
            <Container>
                {/* Header */}
                <VStack {...passwordPolicyStyles.headerContainer}>
                    <HStack {...passwordPolicyStyles.headerRow}>
                        <LucideIcon name="Lock" size={28} color={theme.tokens.colors.textPrimary} />
                        <Heading {...passwordPolicyStyles.pageTitle}>{t('admin.passwordPolicyPage.pageTitle')}</Heading>
                    </HStack>
                    <Text {...passwordPolicyStyles.pageSubtitle}>{t('admin.passwordPolicyPage.pageSubtitle')}</Text>
                </VStack>

                {/* Section 1: Hierarchy */}
                <Box {...passwordPolicyStyles.sectionContainer}>
                    <Box {...passwordPolicyStyles.sectionHeader}>
                        <LucideIcon name="Lock" size={20} color={theme.tokens.colors.textPrimary} />
                        <VStack {...passwordPolicyStyles.headerTextContainer}>
                            <Heading {...passwordPolicyStyles.sectionTitle}>{t('admin.passwordPolicyPage.section1.title')}</Heading>
                            <Text {...passwordPolicyStyles.sectionSubtitle}>{t('admin.passwordPolicyPage.section1.subtitle')}</Text>
                        </VStack>
                    </Box>

                    <Box {...passwordPolicyStyles.hierarchyGrid}>
                        {HIERARCHY_DATA.map((card) => (
                            <Box key={card.id} {...passwordPolicyStyles.hierarchyCard}>
                                <Box {...passwordPolicyStyles.cardHeader}>
                                    <Box {...passwordPolicyStyles.badge} bg={card.badgeColor}>
                                        <Text {...passwordPolicyStyles.badgeText}>{card.badgeText}</Text>
                                    </Box>
                                    <Text {...passwordPolicyStyles.hierarchyRoleText}>{card.title}</Text>
                                </Box>

                                <VStack space="sm">
                                    {card.sections.map((section, idx) => (
                                        <Box key={idx}>{renderPermissionBlock(section)}</Box>
                                    ))}
                                    {card.note && (
                                        <Text {...passwordPolicyStyles.noteText}>
                                            {card.note}
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                        ))}
                    </Box>

                    {/* Section 2: Requirements */}
                    <Box {...passwordPolicyStyles.innerSectionContainer}>
                        <Box {...passwordPolicyStyles.sectionHeader}>
                            <LucideIcon name="ShieldCheck" size={20} color={theme.tokens.colors.textPrimary} />
                            <Heading {...passwordPolicyStyles.sectionTitle} flex={1}>{t('admin.passwordPolicyPage.section2.title')}</Heading>
                        </Box>

                        <Box {...passwordPolicyStyles.requirementsGrid}>
                            <Box {...passwordPolicyStyles.requirementColumn}>
                                <Text {...passwordPolicyStyles.columnTitle}>{REQUIREMENTS_DATA.strength.title}</Text>
                                <VStack space="xs">
                                    {REQUIREMENTS_DATA.strength.items.map((item, idx) => (
                                        <HStack key={idx} alignItems="center" space="sm">
                                            <Box {...passwordPolicyStyles.bullet} />
                                            <Text {...passwordPolicyStyles.listItemText}>{item}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </Box>

                            <Box {...passwordPolicyStyles.requirementColumn}>
                                <Text {...passwordPolicyStyles.columnTitle}>{REQUIREMENTS_DATA.process.title}</Text>
                                <VStack space="xs">
                                    {REQUIREMENTS_DATA.process.items.map((item, idx) => (
                                        <HStack key={idx} alignItems="flex-start" space="sm">
                                            <Box {...passwordPolicyStyles.bullet} />
                                            <Text {...passwordPolicyStyles.listItemText}>{item}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ScrollView>
    );
};

export default PasswordPolicy;
