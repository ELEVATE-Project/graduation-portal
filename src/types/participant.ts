import { Participant } from './screens';

/**
 * Participant Status Types
 * Defines the possible enrollment statuses for a participant
 * Uses display format strings matching the UI labels
 */
export type ParticipantStatus =
  | 'Not Onboarded'
  | 'Onboarded'
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
 * Single source of truth for participant data matching the UI structure.
 * Uses display format status strings and contact field.
 */
export interface ParticipantData {
  id: string;                     // Matches exactly as shown in UI (1002, 1006A, P-024, etc.)
  name: string;
  contact: string;                // normalized (was phone)
  status: string;                 // UI labels: Not Onboarded, Onboarded, In Progress...
  progress?: number;              // only for In Progress, Completed, Graduated
  pathway?: string | undefined;   // keep original
  graduationProgress?: number;    // same % as progress OR undefined
  graduationDate?: string;        // only for Completed/Graduated if available
  email?: string;                 // kept from original dataset
  address?: string;               // kept from original dataset
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

