import React, { useMemo } from "react";
import { HStack , VStack, Text, Button, Image, Box, Icon } from "@ui";
import { useLanguage } from '@contexts/LanguageContext';
import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';
import { templateManagementStyles } from './Styles';
import DataTable from '@components/DataTable';
import { getTemplatesColumns } from './TemplatesTableConfig';
import { TEMPLATE_MANAGEMENT_MOCK_DATA } from '@constants/TEMPLATE_MANAGEMENT_MOCK_DATA';
import CSVUploadGuide from './CSVUploadGuide';

const TemplateManagementScreen = () => {
    const { t } = useLanguage();
    const columns = useMemo(() => getTemplatesColumns(), []);

    return(
        <VStack>
           <TitleHeader
            title="admin.menu.templateManagement"
            description="admin.templateManagement.templateManagementDescription"

            right={
                <HStack space="md" alignItems="center">
                    <Button
                    {...titleHeaderStyles.outlineButton}
                    onPress={() => {
                        // Handle bulk upload
                    }}
                    >
                    <HStack space="sm" alignItems="center">
                      
                        <LucideIcon
                            name="FileDown"
                            size={16}
                            color={theme.tokens.colors.textForeground}
                        />
                        <Text {...titleHeaderStyles.outlineButtonText}>
                        {t('admin.actions.downloadSampleCsv')}
                        </Text>
                    </HStack>
                    </Button>
                    
                    <Button
                    {...titleHeaderStyles.solidButton}
                    onPress={() => {
                        // Handle create user
                    }}
                    >
                    <HStack space="sm" alignItems="center">
                        <LucideIcon
                            name="Upload"
                            size={16}
                            color={theme.tokens.colors.white}
                        />
                        <Text {...titleHeaderStyles.solidButtonText}>
                        {t('admin.actions.uploadTemplateCsv')}
                        </Text>
                    </HStack>
                    </Button>
                </HStack>
            }
           />
           <Box {...templateManagementStyles.infoBox}>
                <HStack space="md" alignItems="flex-start">
                    {/* Info Icon */}
                    <LucideIcon
                            name="AlertCircle"
                            size={16}
                        />
                    {/* Content */}
                    <VStack space="sm" flex={1}>
                        <Text {...templateManagementStyles.infoBoxTitle}>
                                {t('admin.templateManagement.infoBox.title')}
                        </Text>

                        <Text {...templateManagementStyles.infoBoxDescription}>
                            {t('admin.templateManagement.infoBox.description')}
                        </Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Table Section with Border */}
            <Box {...templateManagementStyles.tableContainer}>
                {/* Table Section Header */}
                <Box {...templateManagementStyles.tableHeaderContainer}>
                    <Text {...templateManagementStyles.tableHeaderTitle}>
                        {t('admin.templates.tableTitle')}
                    </Text>
                </Box>

                {/* Templates Table */}
                <DataTable
                    data={TEMPLATE_MANAGEMENT_MOCK_DATA}
                    columns={columns}
                    getRowKey={(template) => template.id}
                    isLoading={false}
                    emptyMessage={t('admin.templates.noTemplatesFound')}
                    loadingMessage={t('admin.templates.loadingTemplates')}
                    pagination={{
                        enabled: true,
                        pageSize: 10,
                        maxPageNumbers: 5,
                    }}
                />
            </Box>

            {/* CSV Upload Guide */}
            <CSVUploadGuide />
        </VStack>
    );
}

export default TemplateManagementScreen