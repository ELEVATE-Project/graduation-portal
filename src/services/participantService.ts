import { Participant } from '@app-types/screens';
import type { ParticipantData, Province, Site } from '@app-types/participant';
import { PARTICIPANTS_DATA, PROVINCES, SITES } from '@constants/PARTICIPANTS_LIST';

/**
 * Participant Service
 * Handles participant data operations and transformations
 */

/**
 * Get participants list for table view
 * Maps ParticipantData[] to Participant[] format by converting contact to phone
 */
export const getParticipantsList = (): Participant[] => {
  return PARTICIPANTS_DATA.map((participant) => ({
    id: participant.id,
    name: participant.name,
    phone: participant.contact, // Map contact to phone
    email: participant.email || '',
    address: participant.address,
    progress: participant.progress ?? 0,
    status: participant.status as Participant['status'], // Use display status directly
  }));
};

/**
 * Get participant detail data by ID
 * Returns detailed participant data including status, pathway, and progress
 */
export const getParticipantById = (id: string): ParticipantData | undefined => {
  const participant = PARTICIPANTS_DATA.find(p => p.id === id);
  if (!participant) return undefined;

  return {
    id: participant.id,
    name: participant.name,
    contact: participant.contact,
    status: participant.status,
    progress: participant.progress,
    pathway: participant.pathway || undefined,
    graduationProgress: participant.graduationProgress != null && !isNaN(Number(participant.graduationProgress)) ? participant.graduationProgress : undefined,
    graduationDate: participant.graduationDate && participant.graduationDate !== '' ? participant.graduationDate : undefined,
    email: participant.email,
    address: participant.address,
  };
};

/**
 * Get participant profile data by ID
 * Returns full participant data including contact info and address
 * Currently uses mock data, will be replaced with API call later
 */
export const getParticipantProfile = (id: string): ParticipantData | undefined => {
  return PARTICIPANTS_DATA.find(p => p.id === id);
};

/**
 * Update participant address
 * Currently uses mock data update, will be replaced with API call later
 * 
 * @param id - Participant ID
 * @param address - New address object with street, province, and site
 * @returns Updated participant or undefined if not found
 */
export const updateParticipantAddress = async (
  id: string,
  address: {
    street: string;
    province: string;
    site: string;
  }
): Promise<ParticipantData | undefined> => {
  // TODO: Replace with actual API call
  // Example: return await api.put(`/participants/${id}/address`, address);
  
  // Mock implementation - simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const participant = PARTICIPANTS_DATA.find(p => p.id === id);
      if (participant) {
        // Format address as string for now (can be changed to object later)
        const formattedAddress = `${address.street}, ${address.province}, ${address.site}`;
        participant.address = formattedAddress;
        resolve(participant);
      } else {
        resolve(undefined);
      }
    }, 500); // Simulate network delay
  });
};

/**
 * Get province label by value
 * @param value - Province value
 * @returns Province label or the value if not found
 */
export const getProvinceLabel = (value: string): string => {
  const province = PROVINCES.find(p => p.value === value);
  return province?.label || value;
};

/**
 * Get site label by value
 * @param value - Site value
 * @returns Site label or the value if not found
 */
export const getSiteLabel = (value: string): string => {
  const site = SITES.find(s => s.value === value);
  return site?.label || value;
};

/**
 * Get sites by province (for future API integration)
 * For now, returns all sites. In future, this will filter by province
 * @param provinceValue - Province value to filter sites
 * @returns Array of sites for the given province
 */
export const getSitesByProvince = (provinceValue: string): Site[] => {
  // TODO: Replace with API call that filters sites by province
  // For now, return all sites
  return SITES;
};

