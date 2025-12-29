export const STATUS = {
  NOT_ENROLLED: 'Not Onboarded',
  ENROLLED: 'Onboarded',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DROPOUT: 'Dropped out',
  GRADUATED: 'Graduated',
};

// Task Status Constants
export const TASK_STATUS = {
  TO_DO: 'to-do',
  COMPLETED: 'completed',
} as const;

// Project Status Constants
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
} as const;

// Upload Status Constants
export const UPLOAD_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  FAILED: 'failed',
} as const;

/**
 * Card Status Types
 * Defines the possible status types for assessment survey cards
 */
export const CARD_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  GRADUATED: 'graduated',
} as const;

/**
 * Participant Table Column Keys
 * Defines the column keys used in the participants table
 */
export const PARTICIPANT_COLUMN_KEYS = {
  NAME: 'name',
  ID: 'id',
  PROGRESS: 'progress',
  GRADUATED: 'graduated',
  PHONE: 'phone',
} as const;

export const PARTICIPANT_DETAILS_TABS = {
  INTERVENTION_PLAN: 'intervention-plan',
  ASSESSMENTS_SURVEYS: 'assessment-surveys',
};
