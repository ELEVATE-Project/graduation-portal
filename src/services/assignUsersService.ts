/**
 * Assign Users Service
 * Service functions for the Assign Users screen
 * Handles API calls for assigning LCs to Supervisors and Participants to LCs
 */

import type { UserSearchResponse } from '@app-types/Users';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';

// Type declaration for process.env (injected by webpack DefinePlugin on web, available in React Native)
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
} | undefined;

/**
 * Get supervisors list - Dynamic supervisor filter from API
 * Fetches supervisors (tenant_admin) - all supervisors if no province provided, or filtered by province
 * 
 * @param params - Optional parameters including province and pagination
 * @returns A promise resolving to the supervisors response from the API
 */
export const getSupervisorsByProvince = async (
  params?: { provinceId?: string; page?: number; limit?: number }
): Promise<UserSearchResponse> => {
  try {
    const { provinceId, page = 1, limit = 100 } = params || {};
    
    // Build query string
    const queryParams = new URLSearchParams({
      tenant_code: 'brac', // Hardcoded tenant code for browser compatibility
      type: 'tenant_admin',
      page: page.toString(),
      limit: limit.toString(),
    });

    const endpoint = `${API_ENDPOINTS.USERS_LIST}?${queryParams.toString()}`;
    
    // Build request body - province goes in meta.province (only if province is provided)
    const requestBody: any = {};
    if (provinceId && provinceId !== 'all-provinces' && provinceId !== 'all-Provinces') {
      requestBody.meta = {
        province: provinceId,
    };
    }
    
    // POST request to fetch supervisors
    const response = await api.post<UserSearchResponse>(endpoint, requestBody);
    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Get linkage champions (org_admin) list for a program
 * Fetches linkage champions that can be assigned to supervisors
 * 
 * @param programId - Program ID (e.g., "6952469bd9f179bdf8abe717")
 * @param params - Optional parameters (excludeMapped, limit, province, site)
 * @returns A promise resolving to the linkage champions response from the API
 */
export const getLinkageChampions = async (
  programId: string,
  params?: { excludeMapped?: boolean; limit?: number; province?: string; site?: string }
): Promise<UserSearchResponse> => {
  try {
    const { excludeMapped = true, limit = 100, province, site } = params || {};
    
    // Build query string
    const queryParams = new URLSearchParams({
      programId: programId,
      excludeMapped: excludeMapped.toString(),
      limit: limit.toString(),
      type: 'org_admin',
    });

    // Add site as query parameter if provided
    if (site && site !== 'all-sites') {
      queryParams.append('site', site);
    }

    const endpoint = `${API_ENDPOINTS.PROGRAM_USERS_SEARCH}?${queryParams.toString()}`;
    
    // Build request body - province goes in meta.province (similar to usersService)
    const requestBody: any = {};
    if (province && province !== 'all-provinces' && province !== 'all-Provinces') {
      requestBody.meta = {
        province: province, // Province ID (e.g., "6952163ae83c1c00147132a8")
      };
    }
    
    // POST request to fetch linkage champions
    const response = await api.post<UserSearchResponse>(endpoint, requestBody);
    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Get mapped LCs for a supervisor
 * Fetches the list of Linkage Champions assigned to a specific supervisor
 * 
 * @param params - Query parameters
 * @returns A promise resolving to the mapped LCs response from the API
 */
export const getMappedLCsForSupervisor = async (params: {
  userId: string; // Supervisor's user ID
  programId: string; // Program ID
  type?: string; // Entity type (default: "org_admin")
  page?: number; // Page number (default: 1)
  limit?: number; // Limit per page (default: 5)
  search?: string; // Search query (default: "")
}): Promise<any> => {
  try {
    const { userId, programId, type = 'org_admin', page = 1, limit = 5, search = '' } = params;
    
    // Build query string
    const queryParams = new URLSearchParams({
      userId: userId,
      type: type,
      page: page.toString(),
      limit: limit.toString(),
      search: search,
      programId: programId,
    });

    const endpoint = `${API_ENDPOINTS.PARTICIPANTS_LIST}?${queryParams.toString()}`;
    
    // GET request to fetch mapped LCs
    const response = await api.get<any>(endpoint);
    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Assign LCs to Supervisor
 * Creates or updates program user assignments
 * 
 * @param params - Assignment parameters
 * @returns A promise resolving to the API response
 */
export const assignLCsToSupervisor = async (params: {
  userId: string; // Supervisor's user ID
  programId: string; // Program ID
  assignedUserIds: string[]; // Array of LC user IDs
  assignedUsersStatus?: string; // Status for assigned users (default: "ACTIVE")
  userRolesToEntityTypeMap?: Record<string, string>; // Role to entity type mapping
}): Promise<any> => {
  try {
    const {
      userId,
      programId,
      assignedUserIds,
      assignedUsersStatus = 'ACTIVE',
      userRolesToEntityTypeMap = {
        org_admin: 'linkageChampion',
        tenant_admin: 'supervisor',
        user: 'participant',
      },
    } = params;

    const endpoint = API_ENDPOINTS.UPDATE_ENTITY_DETAILS;
    
    const requestBody = {
      userId,
      programId,
      assignedUserIds,
      assignedUsersStatus,
      userRolesToEntityTypeMap,
    };
    
    // Additional headers (static for now)
    const headers = {
      // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
      'admin-access-token': process.env.ADMIN_ACCESS_TOKEN,
      // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
      'tenantId': process.env.TENANT_CODE_NAME,
      // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
      'orgId': process.env.ORG_ID,
    }
    const response = await api.post<any>(endpoint, requestBody, {headers});
    console.log('response', response.data);
    
    // Check if HTTP response status is 200 (success)
    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Check response data status - if it contains an error status, throw error
    const responseData = response.data;
    if (responseData?.status) {
      // Check for error status codes in response body
      if (responseData.status !== 200 && 
          responseData.status !== 'OK' && 
          responseData.status !== 'SUCCESS' &&
          responseData.status.toString().startsWith('ERR_')) {
        throw new Error(responseData?.message || 'API request failed');
      }
    }
    
    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};
