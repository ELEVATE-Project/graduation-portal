import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VStack, HStack, Box, Container, Text, Input, InputField, Pressable } from '@ui';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import {
  getParticipantById,
  getParticipantProfile,
  updateParticipantAddress,
  getSitesByProvince,
} from '../../services/participantService';
import { useLanguage } from '@contexts/LanguageContext';
import NotFound from '@components/NotFound';
import { TabButton } from '@components/Tabs';
import { PARTICIPANT_DETAIL_TABS } from '@constants/TABS';
import { PROVINCES, SITES } from '@constants/PARTICIPANTS_LIST';
import InterventionPlan from './InterventionPlan';
import AssessmentSurveys from './AssessmentSurveys';
import type { ParticipantStatus, ParticipantData, PathwayType } from '@app-types/participant';
import { Modal, useAlert, Select, LucideIcon } from '@ui';
import { usePlatform } from '@utils/platform';
import { profileStyles } from '@components/ui/Modal/Styles';
import { theme } from '@config/theme';
import ProjectPlayer, {
  ProjectPlayerData,
  ProjectPlayerConfig,
} from '../../project-player/index';
import {
  DUMMY_PROJECT_DATA,
} from '@constants/PROJECTDATA';
import { STATUS } from '@constants/app.constant';

/**
 * Parse a formatted address string into its components
 * Expected format: "street, province, site"
 * Returns empty strings for unparseable addresses
 */
const parseAddress = (address: string | undefined): { street: string; province: string; site: string } => {
  if (!address) return { street: '', province: '', site: '' };

  const parts = address.split(',').map(part => part.trim());
  if (parts.length >= 3) {
    // Try to match province and site to known values
    const provinceMatch = PROVINCES.find(p => p.label === parts[1] || p.value === parts[1]);
    const siteMatch = SITES.find(s => s.label === parts[2] || s.value === parts[2]);

    return {
      street: parts[0] || '',
      province: provinceMatch?.value || parts[1] || '',
      site: siteMatch?.value || parts[2] || '',
    };
  }

  // Can't parse, return empty (user will enter fresh values)
  return { street: '', province: '', site: '' };
};


/**
 * Route parameters type definition for ParticipantDetail screen
 * The route path is configured as '/participants/:id', so the parameter is extracted as 'id'
 * @example navigate('ParticipantDetail', { id: 'P-006' })
 */
type ParticipantDetailRouteParams = {
  id?: string;
};

/**
 * Route type for ParticipantDetail screen
 */
type ParticipantDetailRouteProp = RouteProp<{
  params: ParticipantDetailRouteParams;
}>;

/**
 * ParticipantDetail Component
 * Displays participant details with status-based header variations.
 */
export default function ParticipantDetail() {
  const route = useRoute<ParticipantDetailRouteProp>();
  const { t } = useLanguage();
  const { showAlert } = useAlert();

  // Extract the id parameter from the route
  const participantId = route.params?.id;

  const [activeTab, setActiveTab] = useState<string>('intervention-plan');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState<{
    street: string;
    province: string;
    site: string;
  }>({
    street: '',
    province: '',
    site: '',
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [currentParticipantProfile, setCurrentParticipantProfile] = useState<
    ParticipantData | undefined
  >(participantId ? getParticipantProfile(participantId) : undefined);

  // Fetch participant data from mock data by ID
  // Ensure participantId exists before calling getParticipantById
  const participant = participantId
    ? getParticipantById(participantId)
    : undefined;

  // Update currentParticipantProfile if participantId changes
  useEffect(() => {
    if (participantId) {
      setCurrentParticipantProfile(getParticipantProfile(participantId));
    }
  }, [participantId]);

  // Error State: Participant Not Found
  if (!participant) {
    return <NotFound message="participantDetail.notFound.title" />;
  }

  // Extract participant data
  // Type assertion not needed as participant is guaranteed to exist here
  const {
    name: participantName,
    id,
    status,
    pathway,
    graduationProgress,
    graduationDate,
  } = participant;


  // Determine ProjectPlayer config and data based on participant status
  const configData: ProjectPlayerConfig = {
    mode: 'edit',
    solutionId: 'sol-community-health-001',
    projectId: 'proj-graduation',
    profileInfo: {
      id: id,
      name: participantName,
    },
  };

  const ProjectPlayerConfigData: ProjectPlayerData = {
    solutionId: configData.solutionId,
    projectId: configData.projectId,
    localData: DUMMY_PROJECT_DATA,
  };

  return (
    <>
      <Box flex={1} bg="$accent100">
        <VStack
          {...participantDetailStyles.container}
          $web-boxShadow={participantDetailStyles.containerBoxShadow}
        >
          <Container>
            {/* Participant Header with status-based variations */}
            <ParticipantHeader
              participantName={participantName}
              participantId={id}
              status={status as ParticipantStatus}
              pathway={pathway as PathwayType}
              graduationProgress={graduationProgress}
              graduationDate={graduationDate}
              onViewProfile={() => setIsProfileModalOpen(true)}
            />
          </Container>
        </VStack>
        <Container>
          {status === STATUS.NOT_ENROLLED ? (
            // NOT_ENROLLED: Show ProjectPlayer directly with editMode
            <ProjectPlayer config={configData} data={ProjectPlayerConfigData} />
          ) : (
            // ENROLLED, IN_PROGRESS, DROPOUT: Show tabs with ProjectPlayer in InterventionPlan
            <>
              {/* Tabs */}
              <Box width="$full" mt="$4" mb="$6">
                <Box width="$full">
                  <HStack
                    width="$full"
                    bg="$backgroundLight50"
                    borderRadius={50}
                    p={4}
                    gap={4}
                    alignItems="center"
                  >
                    {PARTICIPANT_DETAIL_TABS?.map(tab => (
                      <TabButton
                        key={tab.key}
                        tab={tab}
                        isActive={activeTab === tab.key}
                        onPress={setActiveTab}
                        variant="ButtonTab"
                      />
                    ))}
                  </HStack>
                </Box>
              </Box>

              {/* Tab Content */}
              <Box flex={1} mt="$3" mb="$6" bg="transparent">
                <Box width="$full">
                  <Box width="$full">
                    {activeTab === 'intervention-plan' && (
                      <InterventionPlan
                        participantStatus={status}
                        participantId={id}
                        participantName={participantName}
                      />
                    )}
                    {activeTab === 'assessment-surveys' && (
                      <AssessmentSurveys
                        participantStatus={status as ParticipantStatus}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </Box>

      {/* Profile Modal */}
      {currentParticipantProfile && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setIsEditingAddress(false);
            setEditedAddress({
              street: '',
              province: '',
              site: '',
            });
          }}
          headerTitle={t('participantDetail.profileModal.title')}
          headerDescription={t('participantDetail.profileModal.subtitle', {
            name: participantName,
          })}
          profile={currentParticipantProfile}
          onAddressEdit={() => {
            // Initialize edit mode with current address or empty values
            if (currentParticipantProfile?.address) {
              setEditedAddress({
                street: '',
                province: '',
                site: '',
              });
            }
            setIsEditingAddress(true);
          }}
          isEditingAddress={isEditingAddress}
          editedAddress={editedAddress}
          onAddressChange={(field, value) => {
            setEditedAddress(prev => ({
              ...prev,
              [field]: value,
            }));
          }}
          isSavingAddress={isSavingAddress}
          onCancelEdit={() => { // Added handler for cancel button in profile mode
            setIsEditingAddress(false);
            setEditedAddress({
              street: '',
              province: '',
              site: '',
            });
          }}
          onSaveAddress={async () => {
            if (
              !editedAddress.street ||
              !editedAddress.province ||
              !editedAddress.site
            ) {
              showAlert(
                'warning',
                t('participantDetail.profileModal.fillAllFields'),
                {
                  placement: 'bottom-right',
                },
              );
              return;
            }

            setIsSavingAddress(true);
            try {
              const updated = await updateParticipantAddress(id, editedAddress);
              if (updated) {
                setCurrentParticipantProfile(updated);
                setIsEditingAddress(false);
                showAlert(
                  'success',
                  t('participantDetail.profileModal.addressUpdated'),
                  {
                    placement: 'bottom-right',
                  },
                );
              } else {
                showAlert('error', t('common.error'), {
                  placement: 'bottom-right',
                });
              }
            } catch (error) {
              showAlert('error', t('common.error'), {
                placement: 'bottom-right',
              });
            } finally {
              setIsSavingAddress(false);
            }
          }}
        >
          <VStack space="lg">
            {/* Name Field */}
            <VStack space="xs" {...profileStyles.fieldSection}>
              <Text {...profileStyles.fieldLabel}>
                {t('common.profileFields.name')}
              </Text>
              <Text {...profileStyles.fieldValue}>
                {currentParticipantProfile!.name}
              </Text>
            </VStack>

            {/* ID Field */}
            <VStack space="xs" {...profileStyles.fieldSection}>
              <Text {...profileStyles.fieldLabel}>
                {t('common.profileFields.id')}
              </Text>
              <Text {...profileStyles.fieldValue}>
                {currentParticipantProfile!.id}
              </Text>
            </VStack>

            {/* Contact Section */}
            <VStack space="xs" {...(currentParticipantProfile!.address ? profileStyles.fieldSection : {})}>
              <Text {...profileStyles.fieldLabel}>
                {t('common.profileFields.contact')}
              </Text>
              <VStack space="sm">
                <Text {...profileStyles.fieldValue}>
                  {currentParticipantProfile!.contact}
                </Text>
                <Text {...profileStyles.fieldValue}>
                  {currentParticipantProfile!.email}
                </Text>
              </VStack>
            </VStack>

            {/* Address Section */}
            {currentParticipantProfile!.address && (
              <VStack space="xs">
                {!isEditingAddress ? (
                  <>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text {...profileStyles.fieldLabel}>
                        {t('common.profileFields.address')}
                      </Text>
                      <Pressable onPress={() => {
                        // Pre-populate with existing address if available and parseable
                        const parsed = parseAddress(currentParticipantProfile?.address);
                        setEditedAddress(parsed);
                        setIsEditingAddress(true);
                      }}>
                        <LucideIcon
                          name="Pencil"
                          size={16}
                          color={theme.tokens.colors.primary500}
                        />
                      </Pressable>
                    </HStack>
                    <Text {...profileStyles.fieldValue}>
                      {currentParticipantProfile!.address}
                    </Text>
                  </>
                ) : (
                  <VStack space="sm">
                    {/* Street Address Input */}
                    <VStack space="xs">
                      <Text {...profileStyles.fieldLabel}>
                        {t('common.profileFields.address')}
                      </Text>
                      <Input
                        {...profileStyles.input}
                        $focus-borderColor={theme.tokens.colors.inputFocusBorder}
                      >
                        <InputField
                          placeholder={t('common.profileFields.addressFields.street')}
                          value={editedAddress?.street || ''}
                          onChangeText={(value) => {
                            setEditedAddress(prev => ({
                              ...prev,
                              street: value,
                            }));
                          }}
                        />
                      </Input>
                    </VStack>

                    {/* Province Dropdown */}
                    <VStack space="xs">
                      <Select
                        options={PROVINCES.map(p => ({ label: p.label, value: p.value }))}
                        value={editedAddress?.province || ''}
                        onChange={(value) => {
                          setEditedAddress(prev => ({
                            ...prev,
                            province: value,
                            site: '', // Reset site when province changes
                          }));
                        }}
                        placeholder={t('participantDetail.profileModal.selectProvince')}
                        bg="$white" borderColor="transparent"
                      />
                    </VStack>

                    {/* Site Dropdown */}
                    <VStack space="xs">
                      <Select
                        options={getSitesByProvince(editedAddress?.province || '').map(s => ({
                          label: s.label,
                          value: s.value
                        }))}
                        value={editedAddress?.site || ''}
                        onChange={(value) => {
                          setEditedAddress(prev => ({
                            ...prev,
                            site: value,
                          }));
                        }}
                        placeholder={t('participantDetail.profileModal.selectSite')}
                        bg="$white"
                        borderColor="transparent"
                      />
                    </VStack>
                  </VStack>
                )}
              </VStack>
            )}
          </VStack>
        </Modal>
      )}
    </>
  );
}