import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { ScrollView, Box, Card, HStack, VStack, Text, Pressable, LucideIcon } from '@ui';
import { useRoute, RouteProp } from '@react-navigation/native';
import Modal from '@components/ui/Modal';
import Select from '@components/ui/Inputs/Select';
import idpStyles from './styles';
import PATHWAY_DATA from '@constants/IDP_PATHWAYS';
import IDP_CATEGORIES from '@constants/IDP_CATEGORIES';
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

  type IDPRouteParams = {
    idp: {
      participantId?: string;
    };
  };

  const route = useRoute<RouteProp<IDPRouteParams, 'idp'>>();
  const participantId = route.params?.participantId || '';
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
    if (category && IDP_CATEGORIES[category as keyof typeof IDP_CATEGORIES]) {
      setSubOptions(IDP_CATEGORIES[category as keyof typeof IDP_CATEGORIES]);
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

  const modalBody = (
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
          options={Object.keys(IDP_CATEGORIES)}
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
  );


  return (
    <ScrollView {...(idpStyles.scrollView as any)} flexGrow={1} padding="$3" bg="$bgSecondary" contentContainerStyle={{ flexGrow: 1 }}>
      <Box {...(idpStyles.container as any)} flex={1} px="$2" py="$2">
        {PATHWAY_DATA.map(pathway => (
          <Pressable
            key={pathway.id}
            {...(idpStyles.pressableCard as any)}
            {...(Platform.OS === 'web' ? {
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
        title={t('idp.categoryModal.title')}
        headerIcon={
          <Box {...(idpStyles.modalHeaderIcon as any)}>
            <LucideIcon name="Briefcase" size={20} color={theme.tokens.colors.primary500} />
          </Box>
        }
        onConfirm={handleConfirm}
        confirmText={t('idp.categoryModal.confirmButton')}
        cancelText={t('idp.categoryModal.cancelButton')}
        isConfirmDisabled={!category || !subcategory}
        footerButtonsDirection="vertical"
        size={isWeb ? 'md' : 'lg'}
        maxWidth={isWeb ? undefined : 430}
        headerLayout="horizontal"
        customBody={
          <VStack gap="$2">
            <Text
              {...TYPOGRAPHY.bodySmall}
              color='$textSecondary'
            >
              {t('idp.categoryModal.forParticipant', { name: participantName || 'Participant' })}
            </Text>

            {modalBody}
          </VStack>
        }
      />
      {/* </Box> */}
    </ScrollView >
  );
};

export default DevelopInterventionPlan;
