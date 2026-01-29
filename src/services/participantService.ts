import type { ParticipantData, ParticipantSearchParams, ParticipantSearchResponse, Site } from '@app-types/participant';
import { PARTICIPANTS_DATA, PROVINCES, SITES } from '@constants/PARTICIPANTS_LIST';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import { ROLE_NAMES, ADMIN_ROLES, LC_ROLES } from '@constants/ROLES';
import { getUserProfile } from './authenticationService';
import { User } from '@contexts/AuthContext';

// Type declaration for process.env (injected by webpack DefinePlugin on web, available in React Native)
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
} | undefined;


/**
 * Role data from API
 */
export interface Role {
  id: number;
  title: string;
  user_type: number;
  visibility: string;
  label: string;
  status: string;
  organization_id: number;
  tenant_code: string;
}

/**
 * Get participants/users list for table view
 * Handles both participants (with entity_id) and users (with user_ids or filters)
 * 
 * For participants: Requires entity_id, fetches sub-entities, then searches by those IDs
 * For users: Can use user_ids directly or search/filter without entity_id
 *
 * @param params - Search parameters including optional user_ids, entity_id, and filter params
 * @returns A promise resolving to the search response from the API
 */
export const getParticipantsList = async (params: ParticipantSearchParams): Promise<ParticipantSearchResponse> => {
  try {
    const {
      user_ids,
      tenant_code = process?.env?.TENANT_CODE_NAME || 'brac',
      type = ROLE_NAMES.USER,
      page = 1,
      limit = 20, 
      search,
      entity_id,
      role,
      status,
      province,
      site,
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      tenant_code: tenant_code || '',
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add optional search parameter
    if (search) {
      queryParams.append('search', search);
    }

    // Add optional filter parameters
    if (role) {
      queryParams.append('role', role);
    }
    if (status) {
      queryParams.append('status', status);
    }
    if (province) {
      queryParams.append('province', province);
    }
    if (site) {
      queryParams.append('site', site);
    }

    const endpoint = `${API_ENDPOINTS.PARTICIPANTS_LIST}?${queryParams.toString()}`;
    
    // Log the complete API URL with query parameters (for debugging)
    console.log('API URL:', endpoint);
    const paramsObj: Record<string, string> = {};
    queryParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    console.log('Query Parameters:', paramsObj);
    
    // Determine user_ids to send in POST body
    let finalUserIds: string[] | null = null;

    if (user_ids !== undefined) {
      // If user_ids is explicitly provided (can be null), use it directly
      finalUserIds = user_ids;
    } else if (entity_id?.trim()) {
      // If entity_id is provided, fetch sub-entities first (participants flow)
      const subEntityListEndpoint = `${API_ENDPOINTS.PARTICIPANTS_SUB_ENTITY_LIST}/${encodeURIComponent(entity_id)}?type=${ROLE_NAMES.PARTICIPANT.toLowerCase()}`;
      const subEntityListResponse = await api.get<any>(subEntityListEndpoint);
      const subEntityList = subEntityListResponse.data?.result?.data || [];
      finalUserIds = subEntityList.map((subEntity: any) => subEntity.externalId);
    }
    // If neither user_ids nor entity_id is provided, finalUserIds remains null (users search flow)

    const response = await api.post<ParticipantSearchResponse>(endpoint, {
      user_ids: finalUserIds,
    });

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Get participant profile data by ID
 * Returns full participant data including contact info and address
 * Currently uses mock data, will be replaced with API call later
 */
export const getParticipantProfile = async (id: string): Promise<User |undefined> => {
  try {
    const userProfile = await getUserProfile(id);

    return userProfile;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
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


/**
 * Get user roles list for filter dropdown - Dynamic role filter from API
 * Fetches available roles from the API with pagination support
 */
export interface RolesListParams {
  page?: number;
  limit?: number;
}

export const getRolesList = async (
  params?: RolesListParams
): Promise<{
  responseCode: string;
  message: string;
  result: {
    data: Role[];
    count: number;
  };
}> => {
  try {
    const { page = 1, limit = 100 } = params || {};
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const endpoint = `${API_ENDPOINTS.USER_ROLES_LIST}?${queryParams.toString()}`;
    
    // GET request to fetch roles
    const response = await api.get<{
      responseCode: string;
      message: string;
      result: {
        data: Role[];
        count: number;
      };
    }>(endpoint);

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Entity Types List Response
 * Response structure from the entity types API
 */
export interface EntityTypesListResponse {
  message: string;
  status: number;
  result: Array<{
    _id: string;
    name: string;
  }>;
}

/**
 * Province data from API
 */
export interface ProvinceEntity {
  _id: string;
  externalId: string;
  name: string;
  locationId: string;
}

/**
 * Get entity types list and store in local storage - Cache entity types for province filters
 * Stores entity type name-id pairs for later use
 */
export const getEntityTypesList = async (): Promise<EntityTypesListResponse> => {
  try {
    const endpoint = API_ENDPOINTS.ENTITY_TYPES_LIST;
    
    // GET request - internal-access-token header is added automatically by interceptor for entity-management endpoints
    const response = await api.get<EntityTypesListResponse>(endpoint);

    // Store entity types in local storage (name -> _id mapping)
    if (response.data?.result && Array.isArray(response.data.result)) {
      const entityTypesMap: Record<string, string> = {};
      response.data.result.forEach((entityType) => {
        entityTypesMap[entityType.name] = entityType._id;
      });
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.ENTITY_TYPES,
        JSON.stringify(entityTypesMap)
      );
    }

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Get entity types from local storage
 * Returns cached entity types if available
 */
export const getEntityTypesFromStorage = async (): Promise<Record<string, string> | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.ENTITY_TYPES);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error reading entity types from storage:', error);
    return null;
  }
};

/**
 * Get provinces list by entity type ID - Dynamic province filter from API
 * Uses the province entity type ID to fetch all provinces
 */
export const getProvincesByEntityType = async (
  provinceEntityTypeId: string
): Promise<{
  message: string;
  status: number;
  result: ProvinceEntity[];
}> => {
  try {
    const endpoint = `${API_ENDPOINTS.ENTITIES_BY_TYPE}/${provinceEntityTypeId}`;
    
    // GET request - internal-access-token header is added automatically by interceptor for entity-management endpoints
    const response = await api.get<{
      message: string;
      status: number;
      result: ProvinceEntity[];
    }>(endpoint);

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};


