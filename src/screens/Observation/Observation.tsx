import React from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import ObservationContent from './ObservationContent';
import { useAlert } from '@ui';

/**
 * Route parameters type definition for Observation screen
 */
type ObservationRouteParams = {
  id?: string;
  solutionId?: string;
  submissionNumber?: number;
};

/**
 * Route type for Observation screen
 */
type ObservationRouteProp = RouteProp<{
  params: ObservationRouteParams;
}>;

/**
 * Observation Component Props (for modal usage)
 */
interface ObservationProps {
  id?: string;
  solutionId?: string;
  submissionNumber?: number;
  onClose?: () => void;
}

/**
 * Observation Component
 * Screen component for viewing/editing observations
 * Uses ObservationContent for the actual content and adds navigation handling
 */
const Observation: React.FC<ObservationProps> = ({
  id: propId,
  solutionId: propSolutionId,
  submissionNumber: propSubmissionNumber,
  onClose,
}) => {
  const route = useRoute<ObservationRouteProp>();
  const navigation = useNavigation();
  
  // Use props if provided, otherwise fall back to route params
  const routeParams = route.params as ObservationRouteParams | undefined;
  const id = propId || routeParams?.id || '';
  const solutionId = propSolutionId || routeParams?.solutionId || '';
  const submissionNumber = propSubmissionNumber || routeParams?.submissionNumber;
  const { showAlert } = useAlert();
  const handleBackPress = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: Navigate to participant detail if there's no previous screen
      // @ts-ignore
      navigation.navigate('participant-detail', { id });
    }
  };

  if (!id || !solutionId) {
    return null;
  }

  return (
    <ObservationContent
      id={id}
      solutionId={solutionId}
      submissionNumber={submissionNumber}
      onClose={handleBackPress}
      showAlert={showAlert}
    />
  );
};

export default Observation;
