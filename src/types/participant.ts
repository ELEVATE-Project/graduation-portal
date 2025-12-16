import { Participant } from './screens';

/**
 * Participant Status Types
 * Defines the possible enrollment statuses for a participant
 * Uses underscore format to match API/database conventions and UnifiedParticipant
 */
export type ParticipantStatus =
  | 'not_enrolled'
  | 'enrolled'
  | 'in_progress'
  | 'completed'
  | 'dropout';

/**
 * Pathway Type
 * Defines the possible pathway types for participants
 * These keys correspond to translation keys in locale files
 */
export type PathwayType = 'employment' | 'entrepreneurship';

/**
 * Participant Data Interface
 * Defines the structure of participant data with status and progress tracking.
 */
export interface ParticipantData {
  id: string;
  name: string;
  status: ParticipantStatus;
  pathway?: PathwayType;
  graduationProgress?: number;
  graduationDate?: string;
}

/**
 * Unified Participant Interface
 * Combines Participant and ParticipantData fields for complete participant information.
 * Used as the single source of truth for participant data.
 */
export interface UnifiedParticipant extends Participant {
  status: 'not_enrolled' | 'enrolled' | 'in_progress' | 'completed' | 'dropout';
  pathway?: PathwayType;
  graduationProgress?: number;
  graduationDate?: string;
}

/**
 * Assessment Survey Card Data Interface
 * Defines the structure for assessment survey card data
 */
export interface AssessmentSurveyCardData {
  id: string;
  title: string; // Translation key
  description: string; // Translation key
  additionalInfo?: string; // Optional translation key for additional information
  icon: string; // Lucide icon name
  status: {
    type: 'not-started' | 'in-progress' | 'completed' | 'graduated';
    label: string; // Translation key or text (e.g., "0% Complete", "Not Started", "Graduated")
    percentage?: number; // Optional percentage for progress
  };
  actionButton: {
    label: string; // Translation key
    icon: string; // Lucide icon name
    variant: 'primary' | 'secondary'; // Button style variant
    onPress?: () => void; // Optional action handler
  };
  // Visibility rules based on participant status
  visibilityRules?: {
    showForStatuses?: Array<ParticipantStatus>;
    hideForStatuses?: Array<ParticipantStatus>;
  };
}

/**
 * Assessment Survey Card Props Interface
 */
export interface AssessmentSurveyCardProps {
  card: AssessmentSurveyCardData;
}

/**
 * Province Interface
 * Defines the structure for province selection options
 */
export interface Province {
  value: string;
  label: string;
}

/**
 * Site Interface
 * Defines the structure for site selection options
 */
export interface Site {
  value: string;
  label: string;
  type: 'Urban' | 'Rural' | 'Peri-urban';
}