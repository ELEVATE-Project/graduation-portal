import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VStack, HStack, Box, Container } from '@ui';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import {
  getParticipantById,
  getParticipantProfile,
  updateParticipantAddress,
} from '../../services/participantService';
import { useLanguage } from '@contexts/LanguageContext';
import NotFound from '@components/NotFound';
import { TabButton } from '@components/Tabs';
import { PARTICIPANT_DETAIL_TABS } from '@constants/TABS';
import InterventionPlan from './InterventionPlan';
import AssessmentSurveys from './AssessmentSurveys';
import type {
  ParticipantStatus,
  UnifiedParticipant,
} from '@app-types/participant';
import { Modal, useAlert } from '@ui';
import ProjectPlayer, { ProjectPlayerData } from '../../project-player/index';
import {
  DUMMY_PROJECT_DATA,
  COMPLEX_PROJECT_DATA,
  PROJECT_PLAYER_CONFIGS,
} from '@constants/PROJECTDATA';
import { STATUS } from '@constants/app.constant';

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
    UnifiedParticipant | undefined
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
  let configData;
  let projectData;

  switch (status) {
    case STATUS.NOT_ENROLLED:
      configData = {
        mode: PROJECT_PLAYER_CONFIGS.editMode,
        // showAddCustomTaskButton: false,
      };
      projectData = DUMMY_PROJECT_DATA;
      break;
    case STATUS.ENROLLED:
      configData = PROJECT_PLAYER_CONFIGS.previewMode;
      projectData = COMPLEX_PROJECT_DATA;
      break;
    case STATUS.IN_PROGRESS:
      configData = PROJECT_PLAYER_CONFIGS.editMode;
      projectData = COMPLEX_PROJECT_DATA;
      break;
    case STATUS.DROPOUT:
      configData = PROJECT_PLAYER_CONFIGS.readOnlyMode;
      projectData = COMPLEX_PROJECT_DATA;
      break;
    default:
      // Default to preview mode if status is unknown
      configData = PROJECT_PLAYER_CONFIGS.previewMode;
      projectData = COMPLEX_PROJECT_DATA;
  }

  const ProjectPlayerConfigData: ProjectPlayerData = {
    solutionId: configData.solutionId,
    projectId: 'projectId' in configData ? configData.projectId : undefined,
    localData: projectData,
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
              status={status}
              pathway={pathway}
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
                      <InterventionPlan participantStatus={status} />
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

      {/* Profile Modal - Using Modal with profile variant */}
      {currentParticipantProfile && (
        <Modal
          variant="profile"
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
          title={t('participantDetail.profileModal.title')}
          subtitle={t('participantDetail.profileModal.subtitle', {
            name: participantName,
          })}
          profile={currentParticipantProfile}
          onAddressEdit={() => {
            // Initialize edit mode with current address or empty values
            if (currentParticipantProfile?.address) {
              // Parse existing address if it's a string, or use empty values
              // For now, we'll start with empty and let user fill
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
          onCancelEdit={() => {
            setIsEditingAddress(false);
            setEditedAddress({
              street: '',
              province: '',
              site: '',
            });
          }}
          isSavingAddress={isSavingAddress}
        />
      )}
    </>
  );
}