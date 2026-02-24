import type {
  UserSearchParams,
  UserSearchResponse,
  Role,
  RolesListParams,
  RolesListResponse,
  ProvinceEntity,
  EntityTypesListResponse,
} from '@app-types/Users';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';
import { ROLE_NAMES } from '@constants/ROLES';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';

// Type declaration for process.env (injected by webpack DefinePlugin on web, available in React Native)
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
} | undefined;

/**
 * Get users list for table view
 * Fetches users based on search and filter parameters
 *
 * @param params - Search parameters including optional search, role, status, province, and site filters
 * @returns A promise resolving to the search response from the API
 */
export const getUsersList = async (params: UserSearchParams): Promise<UserSearchResponse> => {
  try {
    const {
      tenant_code = process?.env?.TENANT_CODE_NAME || 'brac',
      type = ROLE_NAMES.USER,
      page = 1,
      limit = 20, 
      search,
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

    // Add optional filter parameters (except province - it goes in body)
    if (role) {
      queryParams.append('role', role);
    }
    if (status) {
      queryParams.append('status', status);
    }
    if (site) {
      queryParams.append('site', site);
    }

    const endpoint = `${API_ENDPOINTS.USERS_LIST}?${queryParams.toString()}`;
    
    // Build request body - province goes in meta.province
    const requestBody: any = {};
    if (province) {
      requestBody.meta = {
        province: province, // Province ID (e.g., "6952163ae83c1c00147132a8")
      };
    }
    
    // Log the complete API URL with query parameters (for debugging)
    console.log('API URL:', endpoint);
    const paramsObj: Record<string, string> = {};
    queryParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    console.log('Query Parameters:', paramsObj);
    console.log('Request Body:', requestBody);
    
    // POST request to fetch users
    const response = await api.post<UserSearchResponse>(endpoint, requestBody);
    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Get user roles list for filter dropdown - Dynamic role filter from API
 * Fetches available roles from the API with pagination support
 */
export const getRolesList = async (
  params?: RolesListParams
): Promise<RolesListResponse> => {
  try {
    const { page = 1, limit = 100 } = params || {};
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const endpoint = `${API_ENDPOINTS.USER_ROLES_LIST}?${queryParams.toString()}`;
    
    // GET request to fetch roles
    const response = await api.get<RolesListResponse>(endpoint);

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

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
