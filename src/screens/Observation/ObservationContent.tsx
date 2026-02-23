import React, { useEffect, useState, useCallback, useRef } from 'react';
import WebComponentPlayer from '@components/WebComponent/WebComponentPlayer';
import { Container, Spinner, VStack, Box } from '@ui';
import { getToken } from '../../services/api';
import {
  createObservationSubmission,
  getObservationEntities,
  getObservationSolution,
  getObservationSubmissions,
  searchObservationEntities,
  updateObservationEntities,
} from '../../services/solutionService';
import { useLanguage } from '@contexts/LanguageContext';
import Header from './Header';
import offlineStorage from '../../services/offlineStorage';
import { observationStyles } from './Styles';
import { CARD_STATUS } from '@constants/app.constant';
import logger from '@utils/logger';

interface ObservationData {
  entityId: string;
  observationId: string;
}

/**
 * ObservationContent Component Props
 * Component without navigation dependencies - can be used in modals
 */
interface ObservationContentProps {
  id: string;
  solutionId: string;
  submissionNumber?: number;
  onClose?: () => void;
  showAlert: (type: string, message: string, options?: any) => void;
}

/**
 * ObservationContent Component
 * Component for viewing/editing observations without navigation dependencies
 */
const ObservationContent: React.FC<ObservationContentProps> = ({
  id,
  solutionId,
  submissionNumber,
  onClose,
  showAlert
}) => {
  const { t } = useLanguage();
  const [observation, setObservation] = useState<ObservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [participantInfo, setParticipantInfo] = useState<{
    name: string;
    date: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mockData, setMockData] = useState<any>();
  const [submission, setSubmission] = useState<any>(null);
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
    submissionNumberInput
  }: {
    entityId: string;
    observationId: string;
    submissionNumberInput: number | undefined;
  }) => {
    try {
      let observationSubmissions = await getObservationSubmissions({
        observationId,
        entityId,
      });
      if(!observationSubmissions.result || observationSubmissions.result.length === 0) { 
        await createObservationSubmission({
          observationId: observationId,
          entityId: entityId,
        });
        observationSubmissions = await getObservationSubmissions({
          observationId,
          entityId,
        });
      }
      let observationSubmissionsLast;
      let observationSolution: any = null;
      if(submissionNumberInput) {
        observationSubmissionsLast = observationSubmissions.result.find((submissionItem: any) => submissionItem.submissionNumber === submissionNumberInput);
        if(!observationSubmissionsLast && submissionNumberInput !== 1) {
          showAlert( 'error', `${t('logVisit.thisFormNotFound')} ${submissionNumberInput}`,
            {duration: 10000},
          );
          return;
        }
      } else {
        observationSubmissionsLast = observationSubmissions.result.find((submissionItem: any) => submissionItem.status === CARD_STATUS.IN_PROGRESS || submissionItem.status === CARD_STATUS.NOT_STARTED);
        if (!observationSubmissionsLast) {
          observationSubmissionsLast = observationSubmissions.result?.[0] || null;
        }
      }
      if (observationSubmissionsLast && observationSubmissionsLast.status !== CARD_STATUS.COMPLETED) {
        const submissionId = observationSubmissionsLast._id;
        observationSolution = await offlineStorage.read(submissionId, {
          dbName: 'questionnairePlayer',
          storeName: 'questionnaire',
        });
      }

      if (!observationSolution) {
        let numsub;
        if(submissionNumberInput) {
          numsub = submissionNumberInput;
        } else if(observationSubmissionsLast?.status === CARD_STATUS.COMPLETED){
          numsub = observationSubmissionsLast?.submissionNumber + 1;
        } else if(observationSubmissionsLast?.submissionNumber){
          numsub = observationSubmissionsLast?.submissionNumber;
        } else {
          numsub = 1;
        }
        const response = await getObservationSolution({
          observationId,
          entityId,
          submissionNumber:numsub,
          evidenceCode:observationSubmissionsLast?.evidencesStatus?.[0]?.code,
        });
        observationSolution = response.result;
      }
      setSubmission(observationSubmissionsLast);
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
      try {
        const observationData = await getObservationEntities({
          solutionId,
          profileData: {},
        });
        if(!observationData.result?.allowMultipleAssessemts && submissionNumber && submissionNumber > 1){
          showAlert('error', t('logVisit.multipleAssessemtsNotAllowed'));
          return;
        }
        const observationId = observationData?.result?._id;
        if (observationId) {
          const newData = observationData?.result?.entities?.find(
            (entity: any) => entity.externalId === id,
          );
          if (newData) {
            fetchObservationSolution({
              entityId: newData._id,
              observationId: observationId,
              submissionNumberInput: !observationData.result?.allowMultipleAssessemts ? 1 : submissionNumber,
            });
            // Set participant info
            setParticipantInfo({
              name: newData.name || '',
              date: new Date().toISOString().split('T')[0],
            });
            setLoadingOff();
          } else {
            const entitiesData = await searchObservationEntities({
              observationId: observationId,
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
                    submissionNumberInput: !observationData.result?.allowMultipleAssessemts ? 1 : submissionNumber,
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
          }
        } else {
          showAlert('error', t('observation.noParticipantFound'));
          setLoadingOff();
        }
      } catch (error: any) {
        showAlert('error', t('observation.noParticipantFoundError') + ' : ' + error.message);
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
  }, [solutionId, id, submissionNumber]);

  const handleBackPress = useCallback(() => {
    if (onClose) {
      onClose();
      return false;
    }
    return false;
  }, [onClose]);

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
    [],
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
      evidenceCode: mockData?.assessment?.evidences[0]?.code,
      index: 0,
      submissionNumber: submissionNumber,
      solutionId: observation?.observationId,
      showSaveDraftButton: true,
      progressCountOptionalFields:false,
      progressCalculationLevel: 'input' as const,
      mockData: mockData,
      usePageQuestionsGrid: true,
    }),
    [token, observation?.observationId, observation?.entityId, mockData, submissionNumber],
  );
  
  const handleAfterSubmit = (event?: any) => {
    logger.info('event', event);
    handleBackPress();
  };
  
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
          status={submission?.status || ''}
        />

        <Container>
          {/* Web Component Player */}
          <Box {...observationStyles.webComponentPlayerContainer}>
            {mockData &&
              <WebComponentPlayer
                getProgress={handleProgressUpdate}
                // @ts-ignore - afterSubmitCallback exists in web version
                afterSubmitCallback={handleAfterSubmit}
                playerConfig={playerConfigMemoized}
              />
            }
          </Box>
        </Container>
      </VStack>
    </>
  );
};

export default ObservationContent;

