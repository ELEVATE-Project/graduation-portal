import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VStack, HStack, Box, Container, ScrollView } from '@ui';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import { getParticipantById, getParticipantProfile, updateParticipantAddress } from '../../services/participantService';
import { useLanguage } from '@contexts/LanguageContext';
import NotFound from '@components/NotFound';
import { TabButton } from '@components/Tabs';
import { PARTICIPANT_DETAIL_TABS } from '@constants/TABS';
import InterventionPlan from './InterventionPlan';
import AssessmentSurveys from './AssessmentSurveys';
import type { ParticipantStatus, UnifiedParticipant } from '@app-types/participant';
import { Modal, useAlert } from '@ui';

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
  const [currentParticipantProfile, setCurrentParticipantProfile] = useState<UnifiedParticipant | undefined>(
    participantId ? getParticipantProfile(participantId) : undefined
  );

  // Fetch participant data from mock data by ID
  // Ensure participantId exists before calling getParticipantById
  const participant = participantId ? getParticipantById(participantId) : undefined;

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
          {/* Tabs */}
          <Box width="$full" mt="$4" mb="$6">
            <Box
              width="$full" >
              <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <VStack
                  {...participantDetailStyles.container}
                  $web-boxShadow={participantDetailStyles.containerBoxShadow}
                >
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
                </VStack>
                {/* Tabs */}
                <Box width="$full" mt="$4" mb="$6">
                  <Box
                    maxWidth={1200}
                    width="$full"
                    marginHorizontal="auto"
                    px="$6"
                  >
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
                  <Box
                    width="$full"
                  >
                    <Box
                      maxWidth={1200}
                      width="$full"
                      marginHorizontal="auto"
                      px="$6"
                    >
                      <Box
                        width="$full"
                      >
                        {activeTab === 'intervention-plan' && <InterventionPlan participantId={id} participantName={participantName} />}
                        {activeTab === 'assessment-surveys' && <AssessmentSurveys participantStatus={status as ParticipantStatus} />}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </ScrollView>
            </Box>
          </Box>
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
          subtitle={t('participantDetail.profileModal.subtitle', { name: participantName })}
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
            if (!editedAddress.street || !editedAddress.province || !editedAddress.site) {
              showAlert('warning', t('participantDetail.profileModal.fillAllFields'), {
                placement: 'bottom-right',
              });
              return;
            }

            setIsSavingAddress(true);
            try {
              const updated = await updateParticipantAddress(id, editedAddress);
              if (updated) {
                setCurrentParticipantProfile(updated);
                setIsEditingAddress(false);
                showAlert('success', t('participantDetail.profileModal.addressUpdated'), {
                  placement: 'bottom-right',
                });
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
