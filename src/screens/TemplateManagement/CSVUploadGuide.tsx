import React from 'react';
import { VStack, HStack, Text, Box } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { templateManagementStyles } from './Styles';

const CSVUploadGuide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box {...templateManagementStyles.csvGuideContainer}>
      {/* Title */}
      <Text {...templateManagementStyles.csvGuideTitle}>
        {t('admin.templates.csvUploadGuide.title')}
      </Text>

      {/* Two-column layout */}
      <HStack
        space="2xl"
        alignItems="flex-start"
        flexWrap="wrap"
        flexDirection="column"
        $md-flexDirection="row"
      >
        {/* LEFT: Required CSV Columns */}
        <VStack flex={1} space="md" mt="$6">
          <Text {...templateManagementStyles.csvGuideSectionTitle}>
            {t('admin.templates.csvUploadGuide.requiredColumns')}
          </Text>

          <VStack space="xs">
            {[
              { key: 'templateName', label: 'template_name' },
              { key: 'taskId', label: 'task_id' },
              { key: 'taskName', label: 'task_name' },
              { key: 'taskDescription', label: 'task_description' },
              { key: 'outputIndicator', label: 'output_indicator' },
              { key: 'outcomeIndicator', label: 'outcome_indicator' },
            ].map((column, index) => (
              <HStack key={index} space="xs" alignItems="flex-start">
                {/* Bullet */}
                <Text {...templateManagementStyles.csvGuideBullet}>•</Text>

                {/* Label + Description inline */}
                <HStack flex={1} space="xs" alignItems="flex-start">
                  <Text {...templateManagementStyles.csvGuideColumnName}>
                    {column.label}
                  </Text>
                  <Text {...templateManagementStyles.csvGuideColumnDescription}>-</Text>

                  <Text
                    {...templateManagementStyles.csvGuideColumnDescription}
                    flex={1}
                  >
                    {t(`admin.templates.csvUploadGuide.columns.${column.key}`)}
                  </Text>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </VStack>

        {/* RIGHT: Template Workflow */}
        <VStack flex={1} space="md" mt="$6">
          <Text {...templateManagementStyles.csvGuideSectionTitle}>
            {t('admin.templates.csvUploadGuide.templateWorkflow')}
          </Text>

          <VStack space="sm">
            {[1, 2, 3, 4].map((step) => (
              <HStack key={step} space="md" alignItems="center">
                <Box {...templateManagementStyles.csvGuideStepNumber}>
                  <Text {...templateManagementStyles.csvGuideStepNumberText}>
                    {step}
                  </Text>
                </Box>

                <Text {...templateManagementStyles.csvGuideStepText} flex={1}>
                  {t(`admin.templates.csvUploadGuide.steps.step${step}`)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default CSVUploadGuide;
