/**
 * Linkage Champion Profile Types
 * Type definitions for LC profile data structure
 */

export interface LCProfileDetails {
  fullName: string;
  lcId: string;
  emailAddress: string;
  phoneNumber: string;
  serviceArea: string;
  startDate: string;
  languagePreference: 'en' | 'es';
}

export interface LCProfileData {
  profileDetails: LCProfileDetails;
}

