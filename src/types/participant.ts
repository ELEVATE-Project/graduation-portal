import { User } from '@contexts/AuthContext';

/**
 * Participant Status Types
 * Defines the possible enrollment statuses for a participant
 * Uses display format strings matching the UI labels
 */
export type ParticipantStatus =
  | 'Not Onboarded'
  | 'ONBOARDED'
  | 'In Progress'
  | 'Completed'
  | 'Graduated'
  | 'Dropped out';

/**
 * Pathway Type
 * Defines the possible pathway types for participants
 * These keys correspond to translation keys in locale files
 */
export type PathwayType = 'employment' | 'entrepreneurship';

/**
 * Participant Data Interface
 * Defines the structure for participant data including profile and status information
 */
export interface ParticipantData extends User {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  status: ParticipantStatus;
  pathway?: PathwayType;
  progress?: number;
  graduationProgress?: number;
  graduationDate?: string | Date;
  [key: string]: any; // Allow additional properties for flexibility
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
  iconColor?: string; // Optional icon background color
  navigationUrl?: string; // Optional navigation route
  status?: {
    type: 'not-started' | 'in-progress' | 'completed' | 'graduated';
    label: string; // Translation key or text (e.g., "0% Complete", "Not Started", "Graduated")
    percentage?: number; // Optional percentage for progress
  };
  actionButton?: {
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
  userId: string;
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

/**
 * Participant Service
 * Handles participant data operations and transformations
 */

export interface ParticipantSearchParams {
  tenant_code?: string;
  type?: string;
  page?: number;
  limit?: number;
  search?: string;
  entity_id?: string;
}

export interface ParticipantSearchResponse {
  responseCode: string;
  message: string;
  result: any;
}
