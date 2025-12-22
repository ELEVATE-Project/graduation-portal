import React, { useState, useEffect } from 'react';
import { ScrollView, Box, Card, HStack, VStack, Text, Pressable, LucideIcon, Button, ButtonText, Container } from '@ui';
import { useRoute } from '@react-navigation/native';
import { TemplateData } from '@app-types/screens';
import Modal from '@components/ui/Modal';
import { profileStyles } from '@components/ui/Modal/Styles';
import Select from '@components/ui/Inputs/Select';
import templateStyles from './styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { getParticipantById } from '../../services/participantService';
import { getProjectTemplates, getProjectCategories } from '../../services/projectService';
import { usePlatform } from '@utils/platform';
import { useLanguage } from '@contexts/LanguageContext';

const DevelopInterventionPlan: React.FC = () => {

  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [categories, setCategories] = useState<{ name: string; options: string[] }[]>([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subOptions = category ? categories.find((c) => c.name === category)?.options || [] : [];

  const route = useRoute();
  const participantId = (route.params as { id?: string })?.id || '';
  const { t } = useLanguage();
  const { isWeb } = usePlatform();

  // Get participant data from ID
  const participant = participantId ? getParticipantById(participantId) : null;
  const participantName = participant?.name || 'Participant';

  const handleConfirm = () => {
    if (category && subcategory) {
      console.log('Category selected:', { category, subcategory, participantId });
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [templatesData, categoriesData] = await Promise.all([
          getProjectTemplates(),
          getProjectCategories()
        ]);
        setTemplates(templatesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch project data', error);
        setError('Failed to load templates. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView {...(templateStyles.container as any)} contentContainerStyle={{ flexGrow: 1 }}>
      <Container {...(templateStyles.mainContent as any)}>
        {/* Loading State */}
        {isLoading && (
          <Box flex={1} justifyContent="center" alignItems="center" py="$10">
            <Text {...TYPOGRAPHY.paragraph} color="$textSecondary">
              Loading templates...
            </Text>
          </Box>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Box flex={1} justifyContent="center" alignItems="center" py="$10">
            <Text {...TYPOGRAPHY.paragraph} color="$error500">
              {error}
            </Text>
          </Box>
        )}

        {/* Templates List */}
        {!isLoading && !error && templates.map(pathway => (
          <Pressable
            key={pathway.id}
            {...(templateStyles.pressableCard as any)}
            onPress={() => {
              setIsModalOpen(true);
            }}
          >
            <HStack space="md" alignItems="flex-start">
              <Box {...(templateStyles.iconBox as any)} {...(templateStyles.iconContainer as any)}>
                <LucideIcon name="FileText" size={20} color={theme.tokens.colors.iconCyan} />
              </Box>

              <VStack flex={1} space="xs">
                <Text {...TYPOGRAPHY.h3} color='$textLight900'>
                  {pathway.title}
                </Text>
                <Text {...TYPOGRAPHY.bodySmall} color='$textMutedForeground' lineHeight="$lg">
                  {pathway.description}
                </Text>
                <HStack space="sm" alignItems="center" flexWrap="wrap" mt="$2">
                  <Box
                    {...(templateStyles.badge as any)}
                    bg={pathway.tag === 'Employment' ? '$badgeInfoBg' : '$badgeSuccessBg'}
                  >
                    <Text
                      {...TYPOGRAPHY.caption}
                      fontWeight="$medium"
                      color={pathway.tag === 'Employment' ? '$badgeInfoText' : '$badgeSuccessText'}
                    >
                      {pathway.tag}
                    </Text>
                  </Box>
                  <Text {...TYPOGRAPHY.caption} color='$textMutedForeground' mr="$2">
                    {pathway.pillarsCount} {t('template.pathwayCard.pillars')}
                  </Text>
                  <Text {...TYPOGRAPHY.caption} color='$textMutedForeground' mr="$2">•</Text>
                  <Text {...TYPOGRAPHY.caption} color='$textMutedForeground' mr="$2">
                    {pathway.tasksCount} {t('template.pathwayCard.tasks')}
                  </Text>
                  <Text {...TYPOGRAPHY.caption} color='$textMutedForeground' mr="$2">•</Text>
                  <Text {...TYPOGRAPHY.caption} color='$textMutedForeground'>
                    {pathway.version}
                  </Text>
                </HStack>

                <Box {...(templateStyles.pillarsSection as any)}>
                  <Text {...TYPOGRAPHY.label} color='$textLight900' mb="$2">
                    {t('template.pathwayCard.includedPillars')}
                  </Text>
                  <VStack>
                    {pathway.includedPillars.map((pillar: { name: string; tasks: number }, index: number) => (
                      <Text key={index} {...TYPOGRAPHY.bodySmall} color='$textMutedForeground' mb="$1">
                        <Text color='$hoverBorder' mr="$2">• </Text>
                        {pillar.name} ({pillar.tasks} {t('template.pathwayCard.tasksLabel')})
                      </Text>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </HStack>
          </Pressable>
        ))}
      </Container>
      {/* Category modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        headerTitle={t('template.categoryModal.title')}
        headerDescription={t('template.categoryModal.forParticipant', { name: participantName })}
        headerIcon={
          <Box {...(templateStyles.modalHeaderIcon as any)}>
            <LucideIcon name="Briefcase" size={20} color={theme.tokens.colors.primary500} />
          </Box>
        }
        footerContent={
          <Box
            {...(templateStyles.modalFooter as any)}
          >
            <Button
              {...profileStyles.cancelButton}
              width="$full"
              sx={{
                '@md': {
                  width: 'auto',
                },
              }}
              onPress={() => setIsModalOpen(false)}
            >
              <ButtonText color={theme.tokens.colors.textPrimary} {...TYPOGRAPHY.button}>
                {t('template.categoryModal.cancelButton')}
              </ButtonText>
            </Button>
            <Button
              {...profileStyles.confirmButton}
              variant={'solid'}
              width="$full"
              sx={{
                '@md': {
                  width: 'auto',
                },
              }}
              onPress={handleConfirm}
              isDisabled={!category || !subcategory}
            >
              <ButtonText color={theme.tokens.colors.modalBackground} {...TYPOGRAPHY.button}>
                {t('template.categoryModal.confirmButton')}
              </ButtonText>
            </Button>
          </Box>
        }
        size={isWeb ? 'md' : 'lg'}

      >
        <VStack gap="$1">
          <Text
            {...TYPOGRAPHY.bodySmall}
            color='$textSecondary'
            mb="$2"
          >
            {t('template.categoryModal.description')}
          </Text>

          <VStack gap="$1" mb="$2">
            <Text {...TYPOGRAPHY.label} color='$textPrimary'>
              {t('template.categoryModal.categoryLabel')}
            </Text>
            <Select
              options={categories.map((c) => c.name)}
              value={category}
              onChange={(v) => {
                setCategory(v);
                setSubcategory('');
              }}
              placeholder={t('template.categoryModal.categoryPlaceholder')}
              borderColor='$inputBorder'
            />
          </VStack>

          <VStack gap="$1" mb="$1">
            <Text {...TYPOGRAPHY.label} color='$textPrimary'>
              {t('template.categoryModal.subCategoryLabel')}
            </Text>

            <Box opacity={!category ? 0.5 : 1} pointerEvents={!category ? 'none' : 'auto'}>
              <Select
                options={subOptions}
                value={subcategory}
                onChange={(v) => setSubcategory(v)}
                placeholder={t('template.categoryModal.subCategoryPlaceholder')}
                borderColor='$inputBorder'
              />
            </Box>
          </VStack>

          {/* Selected summary - blue info box */}
          {category && subcategory && (
            <Box
              {...(templateStyles.summaryBox as any)}
            >
              <Text {...TYPOGRAPHY.bodySmall} color='$progressBarFillColor' fontWeight="$semibold">
                {t('template.categoryModal.selectedLabel', { category, subcategory })}
              </Text>
              <Text {...TYPOGRAPHY.caption} color='$progressBarFillColor' mt="$1">
                {t('template.categoryModal.selectedDescription')}
              </Text>
            </Box>
          )}
        </VStack>
      </Modal >
      {/* </Box> */}
    </ScrollView >
  );
};

export default DevelopInterventionPlan;