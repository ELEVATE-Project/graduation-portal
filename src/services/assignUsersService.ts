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
 * Get supervisors list by province ID - Dynamic supervisor filter from API
 * Fetches supervisors (tenant_admin) for a specific province
 * 
 * @param provinceId - Province entity ID (e.g., "69806d35b0bb2500136cfba5")
 * @param params - Optional pagination parameters
 * @returns A promise resolving to the supervisors response from the API
 */
export const getSupervisorsByProvince = async (
  provinceId: string,
  params?: { page?: number; limit?: number }
): Promise<UserSearchResponse> => {
  try {
    const { page = 1, limit = 100 } = params || {};
    
    // Build query string
    const queryParams = new URLSearchParams({
      tenant_code: 'brac', // Hardcoded tenant code for browser compatibility
      type: 'tenant_admin',
      page: page.toString(),
      limit: limit.toString(),
    });

    const endpoint = `${API_ENDPOINTS.USERS_LIST}?${queryParams.toString()}`;
    
    // Build request body - province goes in meta.province
    const requestBody: any = {
      meta: {
        province: provinceId,
      },
    };
    
    // POST request to fetch supervisors
    const response = await api.post<UserSearchResponse>(endpoint, requestBody);
    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};
