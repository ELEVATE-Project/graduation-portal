import React, { useState, useEffect } from 'react';
import { ScrollView, Box, Card, HStack, VStack, Text, Pressable, LucideIcon, Button, ButtonText } from '@ui';
import { useRoute, RouteProp } from '@react-navigation/native';
import Modal from '@components/ui/Modal';
import { profileStyles } from '@components/ui/Modal/Styles';
import Select from '@components/ui/Inputs/Select';
import idpStyles from './styles';
import TEMPLATE_PATHWAY_DATA from '@constants/TEMPLATE_PATHWAYS';
import TEMPLATE_CATEGORIES from '@constants/TEMPLATE_CATEGORIES';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { getParticipantById } from '../../services/participantService';
import { usePlatform } from '@utils/platform';
import { useLanguage } from '@contexts/LanguageContext';

const DevelopInterventionPlan: React.FC = () => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subOptions, setSubOptions] = useState<string[]>([]);

  type TemplateRouteParams = {
    template: {
      id?: string;
    };
  };

  const route = useRoute<RouteProp<TemplateRouteParams, 'template'>>();
  const participantId = route.params?.id || '';
  const { t } = useLanguage();
  const { isWeb } = usePlatform();

  // Get participant data from ID
  const participant = participantId ? getParticipantById(participantId) : null;
  const participantName = participant?.name || 'Participant';

  useEffect(() => {
    if (!isModalOpen) {
      setCategory('');
      setSubcategory('');
      setSubOptions([]);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (category && TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES]) {
      setSubOptions(TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES]);
      setSubcategory('');
    } else {
      setSubOptions([]);
      setSubcategory('');
    }
  }, [category]);

  const handleConfirm = () => {
    if (category && subcategory) {
      setIsModalOpen(false);
    }
  };

  return (
    <ScrollView {...(idpStyles.scrollView as any)} flexGrow={1} padding="$3" bg="$bgSecondary" contentContainerStyle={{ flexGrow: 1 }}>
      <Box {...(idpStyles.container as any)} flex={1} px="$2" py="$2">
        {TEMPLATE_PATHWAY_DATA.map(pathway => (
          <Pressable
            key={pathway.id}
            {...(idpStyles.pressableCard as any)}
            {...(isWeb ? {
              onMouseEnter: () => setHoveredCardId(pathway.id),
              onMouseLeave: () => setHoveredCardId(null),
            } as any : {})}
            onPress={() => {
              setIsModalOpen(true);
            }}
          >
            <Card
              {...(idpStyles.cardContent as any)}
              borderColor={hoveredCardId === pathway.id ? '$hoverBorder' : '$borderLight300'}
              {...(idpStyles.card as any)}
            >
              <HStack space="md" alignItems="flex-start">
                <Box {...(idpStyles.iconBox as any)} {...(idpStyles.iconContainer as any)}>
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
                      {...(idpStyles.badge as any)}
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
                      {pathway.pillarsCount} {t('idp.pathwayCard.pillars')}
                    </Text>
                    <Text {...TYPOGRAPHY.caption} color='$textMutedForeground' mr="$2">•</Text>
                    <Text {...TYPOGRAPHY.caption} color='$textMutedForeground' mr="$2">
                      {pathway.tasksCount} {t('idp.pathwayCard.tasks')}
                    </Text>
                    <Text {...TYPOGRAPHY.caption} color='$textMutedForeground' mr="$2">•</Text>
                    <Text {...TYPOGRAPHY.caption} color='$textMutedForeground'>
                      {pathway.version}
                    </Text>
                  </HStack>

                  <Box {...(idpStyles.pillarsSection as any)}>
                    <Text {...TYPOGRAPHY.label} color='$textLight900' mb="$2">
                      {t('idp.pathwayCard.includedPillars')}
                    </Text>
                    <VStack>
                      {pathway.includedPillars.map((pillar, index) => (
                        <Text key={index} {...TYPOGRAPHY.bodySmall} color='$textMutedForeground' mb="$1">
                          <Text color='$hoverBorder' mr="$2">• </Text>
                          {pillar.name} ({pillar.tasks} {t('idp.pathwayCard.tasksLabel')})
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              </HStack>
            </Card>
          </Pressable>
        ))}
      </Box>
      {/* Category modal */}
      {/* <Box mx={isWeb ? 0 : "$10"}> */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        headerTitle={t('idp.categoryModal.title')}
        headerDescription={t('idp.categoryModal.forParticipant', { name: participantName })}
        headerIcon={
          <Box {...(idpStyles.modalHeaderIcon as any)}>
            <LucideIcon name="Briefcase" size={20} color={theme.tokens.colors.primary500} />
          </Box>
        }
        footerContent={
          <Box
            flexDirection="column-reverse"
            sx={{
              '@md': {
                flexDirection: 'row',
                justifyContent: 'flex-end',
              },
            }}
            width="$full"
            justifyContent="center"
            gap="$3"
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
                {t('idp.categoryModal.cancelButton')}
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
              bg={theme.tokens.colors.primary500}
              onPress={handleConfirm}
              $hover-bg={theme.tokens.colors.primary500}
              isDisabled={!category || !subcategory}
            >
              <ButtonText color={theme.tokens.colors.modalBackground} {...TYPOGRAPHY.button}>
                {t('idp.categoryModal.confirmButton')}
              </ButtonText>
            </Button>
          </Box>
        }
        size={isWeb ? 'md' : 'lg'}
        maxWidth={isWeb ? undefined : 430}
      >
        <VStack gap="$1">
          <Text
            {...TYPOGRAPHY.bodySmall}
            color='$textSecondary'
            mb="$2"
          >
            {t('idp.categoryModal.description')}
          </Text>

          <VStack gap="$1" mb="$2">
            <Text {...TYPOGRAPHY.label} color='$textPrimary'>
              {t('idp.categoryModal.categoryLabel')}
            </Text>
            <Select
              options={Object.keys(TEMPLATE_CATEGORIES)}
              value={category}
              onChange={(v) => setCategory(v)}
              placeholder={t('idp.categoryModal.categoryPlaceholder')}
              borderColor='$inputBorder'
            />
          </VStack>

          <VStack gap="$1" mb="$1">
            <Text {...TYPOGRAPHY.label} color='$textPrimary'>
              {t('idp.categoryModal.subCategoryLabel')}
            </Text>

            <Select
              options={subOptions}
              value={subcategory}
              onChange={(v) => setSubcategory(v)}
              placeholder={t('idp.categoryModal.subCategoryPlaceholder')}
              disabled={!category}
              borderColor='$inputBorder'
            />
          </VStack>

          {/* Selected summary - blue info box */}
          {category && subcategory && (
            <Box
              bg='$progressBarBackground'
              padding="$3"
              borderRadius="$md"
              borderWidth={1}
              borderColor='$progressBarFillColor'
              mt="$3"
            >
              <Text {...TYPOGRAPHY.bodySmall} color='$progressBarFillColor' fontWeight="$semibold">
                {t('idp.categoryModal.selectedLabel', { category, subcategory })}
              </Text>
              <Text {...TYPOGRAPHY.caption} color='$progressBarFillColor' mt="$1">
                {t('idp.categoryModal.selectedDescription')}
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