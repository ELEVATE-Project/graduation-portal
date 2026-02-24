import React from 'react';
import { Platform, Linking } from 'react-native';
import { TemplateCard } from './TemplateCard';
import {
    LucideIcon,
    VStack,
    HStack,
    Text,
    Box,
    Heading,
    useToast,
    Toast,
    ToastTitle,
    Container,
    ScrollView,
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import {
    CSV_TEMPLATES_KEYS,
    GUIDELINES_KEYS,
} from '@constants/CSV_TEMPLATE_DATA';
import api from '../../services/api';
import { csvImportStyles } from './Styles';

const CsvImportTemplates = () => {
    const { t } = useLanguage();
    const toast = useToast();

    // Map keys to translated text
    const TEMPLATE_DATA = CSV_TEMPLATES_KEYS.map(item => ({
        id: item.id,
        title: t(item.titleKey),
        description: t(item.descriptionKey),
        templateUrl: item.templateUrl,
    }));

    const GUIDELINES = GUIDELINES_KEYS.map(key => t(key));

    const handleDownload = async (id: string) => {
        const template = TEMPLATE_DATA.find(item => item.id === id);
        if (!template || !template.templateUrl) return;

        try {
            // Construct the full URL if it's a relative path
            let baseUrl = '';
            if (Platform.OS === 'web') {
                baseUrl = window.location.origin;
            } else {
                // For mobile, use the baseURL from the configured api service
                const apiBase = api.defaults.baseURL || '';
                baseUrl = apiBase.replace(/\/api\/?$/, '') || '';
            }

            const fullUrl = template.templateUrl.startsWith('http')
                ? template.templateUrl
                : `${baseUrl}${template.templateUrl}`;

            // Trigger Download using Linking (Cross-platform)
            await Linking.openURL(fullUrl);

            // Show Success Toast only on Web
                toast.show({
                    placement: Platform.OS === 'web' ? 'top right' : 'top',
                    render: ({ id: toastID }) => {
                        return (
                            <Toast nativeID={`toast-${toastID}`} action="success" variant="outline" bg="$white" hardShadow="5" borderColor="$gray300">
                                <HStack space="md" alignItems="center">
                                    <LucideIcon name="CheckCircle" size={20} color="$success600" />
                                    <ToastTitle color="$textPrimary" fontSize="$sm" fontWeight="$bold">
                                        {t('admin.csvTemplatePage.downloadSuccess', { title: template.title })}
                                    </ToastTitle>
                                </HStack>
                            </Toast>
                    )
                }
            });
        } catch (error) {
            console.error('Download error:', error);
            toast.show({
                placement: 'top',
                render: ({ id: toastId }) => {
                    return (
                        <Toast nativeID={`toast-${toastId}`} action="error" variant="outline" bg="$white" hardShadow="5" borderColor="$gray300">
                            <HStack space="md" alignItems="center">
                                <LucideIcon name="AlertCircle" size={20} color="$error600" />
                                <ToastTitle color="$textPrimary" fontSize="$sm" fontWeight="$bold">
                                   {t('common.error')}
                                </ToastTitle>
                            </HStack>
                        </Toast>
                    ) 
                }
            });
        }
    };

    return (
        <ScrollView {...csvImportStyles.container} showsVerticalScrollIndicator={false}>
            <Container>
                <VStack {...csvImportStyles.headerContainer}>
                    <Box>
                        <Heading {...csvImportStyles.pageTitle}>{t('admin.csvTemplatePage.pageTitle')}</Heading>
                        <Text {...csvImportStyles.pageSubtitle}>{t('admin.csvTemplatePage.pageSubtitle')}</Text>
                    </Box>
                </VStack>

                <Box {...csvImportStyles.sectionContainer}>
                    <VStack space="md">
                        <Box>
                            <Heading {...csvImportStyles.sectionTitle}>{t('admin.csvTemplatePage.sectionTitle')}</Heading>
                            <Text {...csvImportStyles.sectionSubtitle}>{t('admin.csvTemplatePage.sectionSubtitle')}</Text>
                        </Box>

                        <HStack {...csvImportStyles.gridContainer} justifyContent="center">
                            {TEMPLATE_DATA.map((item) => (
                                <TemplateCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    buttonText={t('admin.csvTemplatePage.downloadTemplate')}
                                    onDownload={() => handleDownload(item.id)}
                                />
                            ))}
                        </HStack>

                        <Box {...csvImportStyles.guidelinesContainer}>
                            <HStack {...csvImportStyles.guidelinesHeader}>
                                <LucideIcon name="Info" size={20} color="$textSecondary" />
                                <Heading {...csvImportStyles.guidelinesTitle}>{t('admin.csvTemplatePage.guidelines.title')}</Heading>
                            </HStack>

                            <VStack {...csvImportStyles.guidelinesList}>
                                {GUIDELINES.map((guideline, index) => (
                                    <HStack key={index} {...csvImportStyles.guidelineItem}>
                                        <Box {...csvImportStyles.bulletPoint} />
                                        <Text {...csvImportStyles.guidelineText}>{guideline}</Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>
                    </VStack>
                </Box>
            </Container>
        </ScrollView>
    );
};

export default CsvImportTemplates;
