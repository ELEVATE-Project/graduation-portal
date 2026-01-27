import React, { useEffect, useState, useCallback, useRef } from 'react';
import WebComponentPlayer from '@components/WebComponent/WebComponentPlayer';
import { Container, Spinner, useAlert, VStack, Box } from '@ui';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getToken } from '../../services/api';
import {
  getObservationEntities,
  getObservationSolution,
  getObservationSubmissions,
  searchObservationEntities,
  updateObservationEntities,
} from '../../services/solutionService';
import { useLanguage } from '@contexts/LanguageContext';
import Header from './Header';
import offlineStorage from '../../services/offlineStorage';
import { ENTITY_TYPE } from '@constants/ROLES';
import { observationStyles } from './Styles';
interface ObservationData {
  entityId: string;
  observationId: string;
}

const Observation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { id, solutionId } = route.params as {
    id: string;
    solutionId: string;
  };
  const [observation, setObservation] = useState<ObservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [participantInfo, setParticipantInfo] = useState<{
    name: string;
    date: string;
  } | null>(null);
  const { showAlert } = useAlert();

  const [token, setToken] = useState<string | null>(null);
  const [mockData, setMockData] = useState<any>();
  // Use ref to store progress callback to avoid prop changes causing rerenders
  const progressCallbackRef =
    useRef<
      (
        progressValue: number | { data: { percentage: number }; type: string },
      ) => void | undefined
    >(undefined);

  const fetchObservationSolution = async ({
    entityId,
    observationId,
    submissionNumber,
    evidenceCode,
  }: {
    entityId: string;
    observationId: string;
    submissionNumber: number;
    evidenceCode: string;
  }) => {
    try {
      const observationSubmissions = await getObservationSubmissions({
        observationId,
        entityId,
      });
      let observationSolution: any = null;
      if (observationSubmissions.result.length > 0) {
        const submissionId = observationSubmissions.result[0]._id;
        observationSolution = await offlineStorage.read(submissionId, {
          dbName: 'questionnairePlayer',
          storeName: 'questionnaire',
        });
        // submissionNumber = observationSubmissions.result[0].submissionNumber;
      } else {
        // submissionNumber = 1;
      }

      if (!observationSolution) {
        const response = await getObservationSolution({
          observationId,
          entityId,
          submissionNumber,
          evidenceCode,
        });
        observationSolution = response.result;
      }
      setMockData(observationSolution);
      setObservation({
        entityId: entityId,
        observationId: observationId,
      });
    } catch (error: any) {
      showAlert(
        'error',
        `${t('observation.noParticipantFoundError')} : ${error.message}`,
        {
          duration: 10000,
        },
      );
    }
  };

  const setLoadingOff = () => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const fetchObservation = async () => {
      const tokenData = await getToken();
      setToken(tokenData);
      const observationData = await getObservationEntities({
        solutionId,
        profileData: {},
      });
      const observationId = observationData?.result?._id;
      if (
        observationData.result?.entityType === ENTITY_TYPE.PARTICIPANT &&
        Array.isArray(observationData.result?.entities)
      ) {
        const newData = observationData.result.entities.find(
          (entity: any) => entity.externalId === id,
        );
        if (newData) {
          fetchObservationSolution({
            entityId: newData._id,
            observationId: observationId,
            submissionNumber: 1,
            evidenceCode: 'OB',
          });
          // Set participant info
          setParticipantInfo({
            name: newData.name || '',
            date: new Date().toISOString().split('T')[0],
          });
          setLoadingOff();
        } else if (observationId) {
          const entitiesData = await searchObservationEntities({
            observationId: observationId,
            // search: "sagar",
          });
          const entityData = entitiesData.result?.[0]?.data.find(
            (entity: any) => entity.externalId === id,
          );
          if (entityData) {
            try {
              const data = await updateObservationEntities({
                observationId,
                data: [entityData._id],
              });
              if (data) {
                fetchObservationSolution({
                  entityId: entityData._id,
                  observationId: observationId,
                  submissionNumber: 1,
                  evidenceCode: 'OB',
                });
                // Set participant info
                setParticipantInfo({
                  name: entityData.name || 'Participant',
                  date: new Date().toISOString().split('T')[0],
                });
                setLoadingOff();
              }
            } catch (error: any) {
              showAlert(
                'error',
                `${t('observation.noParticipantFoundError')} : ${
                  error.message
                }`,
                { duration: 10000 },
              );
              setLoadingOff();
            }
          }
        } else {
          showAlert('error', t('observation.noParticipantFound'));
          setLoadingOff();
        }
      } else {
        showAlert('error', t('observation.noParticipantFound'));
        setLoadingOff();
      }
    };
    if (solutionId && id) {
      fetchObservation();
    }

    return () => {
      setMockData(null);
      setObservation(null);
      setParticipantInfo(null);
      setProgress(0);
      setLoading(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutionId, id]);

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
      return false;
    } else {
      // Fallback: Navigate to participant detail if there's no previous screen
      // @ts-ignore
      navigation.navigate('participant-detail', { id });
    }
  }, [navigation, id]);

  // Update ref whenever callback changes
  useEffect(() => {
    progressCallbackRef.current = (
      progressValue: number | { data: { percentage: number }; type: string },
    ) => {
      setProgress(
        Math.round(
          (progressValue as { data: { percentage: number } }).data
            ?.percentage || 0,
        ),
      );
    };
  }, []);

  // Stable callback that uses ref - this won't change between renders
  const handleProgressUpdate = useCallback(
    (
      progressValue: number | { data: { percentage: number }; type: string },
    ) => {
      progressCallbackRef.current?.(progressValue);
    },
    [mockData],
  );

  // Memoize playerConfig to prevent WebComponentPlayer rerenders
  const playerConfigMemoized = React.useMemo(
    () => ({
      // @ts-ignore - process.env is injected by webpack DefinePlugin on web
      baseURL: `${process.env.API_BASE_URL}/api`,
      fileSizeLimit: 50,
      userAuthToken: token,
      solutionType: 'observation' as const,
      observationId: observation?.observationId,
      entityId: observation?.entityId,
      evidenceCode: 'OB',
      index: 0,
      submissionNumber: 1,
      solutionId: observation?.observationId,
      showSaveDraftButton: true,
      progressCalculationLevel: 'input' as const,
      mockData: mockData,
      usePageQuestionsGrid: true,
    }),
    [token, observation?.observationId, observation?.entityId, mockData],
  );

  return (
    <>
      <VStack
        {...observationStyles.loadingContainer}
        display={loading ? 'flex' : 'none'}
      >
        <Spinner size="large" color="$primary500" />
      </VStack>

      <VStack
        {...observationStyles.contentContainer}
        display={loading ? 'none' : 'flex'}
      >
        {/* Header Section */}
        <Header
          title={mockData?.solution?.name || ''}
          progress={progress}
          participantInfo={participantInfo}
          onBackPress={handleBackPress}
        />

        <Container>
          {/* Web Component Player */}
          <Box {...observationStyles.webComponentPlayerContainer}>
            {mockData &&
              <WebComponentPlayer
                getProgress={handleProgressUpdate}
                playerConfig={playerConfigMemoized}
              />
            }
          </Box>
        </Container>
      </VStack>
    </>
  );
};

export default Observation;
