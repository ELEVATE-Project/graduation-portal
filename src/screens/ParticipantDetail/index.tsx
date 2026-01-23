import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  InputField,
  Pressable,
  Container,
} from '@ui';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import {
  getParticipantsList,
  getSitesByProvince} from '../../services/participantService';
import { useLanguage } from '@contexts/LanguageContext';
import NotFound from '@components/NotFound';
import { TabButton } from '@components/Tabs';
import { PARTICIPANT_DETAIL_TABS } from '@constants/TABS';
import { PROVINCES } from '@constants/PARTICIPANTS_LIST';
import InterventionPlan from './InterventionPlan';
import AssessmentSurveys from './AssessmentSurveys';
import type {
  ParticipantData,
  ParticipantStatus,
  // PathwayType,
} from '@app-types/participant';
import { Modal, useAlert, Select, LucideIcon } from '@ui';
import { usePlatform } from '@utils/platform';
import { profileStyles } from '@components/ui/Modal/Styles';
import { theme } from '@config/theme';
import ProjectPlayer, { ProjectPlayerData } from '../../project-player/index';
import {
  MODE,
  // DUMMY_PROJECT_DATA,
  PROJECT_PLAYER_CONFIGS,
} from '@constants/PROJECTDATA';
import { PARTICIPANT_DETAILS_TABS, STATUS } from '@constants/app.constant';
import { useAuth, User } from '@contexts/AuthContext';

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

export default function ParticipantDetail() {
  const route = useRoute<ParticipantDetailRouteProp>();
  const {user} = useAuth()
  const { t } = useLanguage();
  const { showAlert } = useAlert();
  const { isWeb } = usePlatform();
  // Extract the id parameter from the route
  const participantId = route.params?.id;
  const [activeTab, setActiveTab] = useState<string>('intervention-plan');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [status, setStatus] = useState('');
  const [idpCreated, setIdpCreated] = useState(false);
  const [editedAddress, setEditedAddress] = useState<{
    street: string;
    province: string;
    site: string;
  }>({
    street: '',
    province: '',
    site: '',
  });
  const [participant, setParticipant] = useState<User | undefined>();
  const [areAllTasksCompleted, setAreAllTasksCompleted] = useState(false);

  useEffect(() => {
    const fetchEntityDetails = async () => {
      if (participantId && user?.id) {
        try {
          const response = await getParticipantsList({entityId:participantId,userId:user?.id})
          const {userDetails,...rest} = response?.result?.data?.[0]
          const participantData = {...(userDetails || {}),...rest}
          setParticipant(participantData);
          setStatus(participantData?.status);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchEntityDetails();
  }, [participantId,user?.id, idpCreated ]);

   const handleIdpCreated=()=>{
    setIdpCreated(true)
  }
  // Error State: Participant Not Found
  if (!participant) {
    return <NotFound message="participantDetail.notFound.title" />;
  }

  
  const {
    name: participantName,
    id,
  } = participant;

  // Determine ProjectPlayer config and data based on participant status
  const config = PROJECT_PLAYER_CONFIGS;
  const selectedMode = MODE.editMode;

  const configData = {
    ...config,
    ...selectedMode,
    showAddCustomTaskButton: false,
    profileInfo: participant,
  };

  const ProjectPlayerConfigData: ProjectPlayerData = {
    projectId : status === STATUS.IN_PROGRESS
      ? participant?.idpProjectId
      : status === STATUS.NOT_ENROLLED
      ? participant?.onBoardedProjectId
      :  participant?.onBoardedProjectId,
    entityId: participant?.entityId,
    userStatus: participant?.status,
  };

  const handleSaveAddress = async () => {
    if (
      !editedAddress.street ||
      !editedAddress.province ||
      !editedAddress.site
    ) {
      showAlert('warning', t('participantDetail.profileModal.fillAllFields'), {
        placement: 'bottom-right',
      });
      return;
    }

    try {
      setParticipant(
        (prev: User | undefined) =>
          ({
            ...(prev as User),
            location: `${editedAddress.street}, ${editedAddress.province}, ${editedAddress.site}`,
          } as User),
      );
      setIsEditingAddress(false);
      showAlert('success', t('participantDetail.profileModal.addressUpdated'), {
        placement: 'bottom-right',
      });
    } catch (error) {
      showAlert('error', t('common.error'), {
        placement: 'bottom-right',
      });
    }
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
              status={participant.status as ParticipantStatus}
              pathway={'employment'}
              graduationProgress={20}
              graduationDate={''}
              onViewProfile={() => setIsProfileModalOpen(true)}
              areAllTasksCompleted={areAllTasksCompleted}
              userEntityId={participant?.entityId}
              onStatusUpdate={newStatus => {
                setStatus(newStatus);
              }}
            />
          </Container>
        </VStack>
        <Container px="$4" py="$6" $md-px="$6">
          {status === STATUS.NOT_ENROLLED ? (
            // NOT_ENROLLED: Show ProjectPlayer directly with editMode
            <ProjectPlayer
              config={configData}
              data={ProjectPlayerConfigData}
              onTaskCompletionChange={setAreAllTasksCompleted}
            />
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
                    {activeTab ===
                      PARTICIPANT_DETAILS_TABS.INTERVENTION_PLAN && (
                      <InterventionPlan
                        participantStatus={status as ParticipantStatus}
                        participantId={id}
                        participantProfile={participant}
                        onIdpCreation ={handleIdpCreated}
                      />
                    )}
                    {activeTab ===
                      PARTICIPANT_DETAILS_TABS.ASSESSMENTS_SURVEYS && (
                      <AssessmentSurveys
                        participant={participant as ParticipantData}
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
        size={isWeb ? 'sm' : 'lg'}
        cancelButtonText={isEditingAddress ? t('common.cancel') : undefined}
        confirmButtonText={
          isEditingAddress
            ? t('participantDetail.profileModal.saveLocation')
            : undefined
        }
        onCancel={() => {
          setIsEditingAddress(false);
          setEditedAddress({
            street: '',
            province: '',
            site: '',
          });
        }}
        onConfirm={handleSaveAddress}
      >
        <VStack space="lg">
          {/* Name Field */}
          <VStack space="xs" {...profileStyles.fieldSection}>
            <Text {...profileStyles.fieldLabel}>
              {t('common.profileFields.name')}
            </Text>
            <Text {...profileStyles.fieldValue}>{participant!.name}</Text>
          </VStack>

          {/* ID Field (externalId) */}
          <VStack space="xs" {...profileStyles.fieldSection}>
            <Text {...profileStyles.fieldLabel}>
              {t('common.profileFields.id')}
            </Text>
            <Text {...profileStyles.fieldValue}>{participant!.id}</Text>
          </VStack>

          {/* Contact Section */}
          <VStack
            space="xs"
            {...(participant!.location ? profileStyles.fieldSection : {})}
          >
            <Text {...profileStyles.fieldLabel}>
              {t('common.profileFields.contact')}
            </Text>
            <VStack space="sm">
              <Text {...profileStyles.fieldValue}>{participant!.contact}</Text>
              <Text {...profileStyles.fieldValue}>{participant!.email}</Text>
            </VStack>
          </VStack>

          {/* Address Section */}
          {participant!.location && (
            <VStack space="xs">
              {!isEditingAddress ? (
                <>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text {...profileStyles.fieldLabel}>
                      {t('common.profileFields.address')}
                    </Text>
                    <Pressable
                      onPress={() => {
                        setEditedAddress({
                          street: '',
                          province: '',
                          site: '',
                        });
                        setIsEditingAddress(true);
                      }}
                    >
                      <LucideIcon
                        name="Pencil"
                        size={16}
                        color={theme.tokens.colors.primary500}
                      />
                    </Pressable>
                  </HStack>
                  <Text {...profileStyles.fieldValue}>
                    {participant!.location}
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
                        placeholder={t(
                          'common.profileFields.addressFields.street',
                        )}
                        value={editedAddress?.street || ''}
                        onChangeText={value => {
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
                      options={PROVINCES.map(p => ({
                        label: p.label,
                        value: p.value,
                      }))}
                      value={editedAddress?.province || ''}
                      onChange={value => {
                        setEditedAddress(prev => ({
                          ...prev,
                          province: value,
                          site: '', // Reset site when province changes
                        }));
                      }}
                      placeholder={t(
                        'participantDetail.profileModal.selectProvince',
                      )}
                      bg="$white"
                      borderColor="transparent"
                    />
                  </VStack>

                  {/* Site Dropdown */}
                  <VStack space="xs">
                    <Select
                      options={getSitesByProvince(
                        editedAddress?.province || '',
                      ).map(s => ({
                        label: s.label,
                        value: s.value,
                      }))}
                      value={editedAddress?.site || ''}
                      onChange={value => {
                        setEditedAddress(prev => ({
                          ...prev,
                          site: value,
                        }));
                      }}
                      placeholder={t(
                        'participantDetail.profileModal.selectSite',
                      )}
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
    </>
  );
}
