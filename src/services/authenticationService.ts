import api, { saveToken } from './api';
import { API_ENDPOINTS } from './apiEndpoints';
import offlineStorage from './offlineStorage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import logger from '@utils/logger';

export interface LoginResponse {
  responseCode: string;
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
    user: any;
  };
}

/**
 * Logs in the user with the specified credentials.
 *
 * @param identifier - The user's identifier (usually email or username)
 * @param password - The user's password
 * @param isAdmin - Whether to use admin login endpoint (defaults to false)
 * @returns A promise resolving to the login response from the API
 */
export const login = async (
  identifier: string,
  password: string,
  isAdmin: boolean = false
): Promise<LoginResponse> => {
  try {
    // Determine the endpoint based on isAdmin flag
    const endpoint = isAdmin ? API_ENDPOINTS.ADMIN_LOGIN : API_ENDPOINTS.LOGIN;

    const response = await api.post<LoginResponse>(endpoint, {
      identifier,
      password,
    });

    const responseData = response.data;

    // Extract tokens and user from result
    const { access_token, refresh_token, user } = responseData.result || {};
    
    // Validate and save access token (must be non-empty string)
    if (access_token && typeof access_token === 'string' && access_token.trim().length > 0) {
      await saveToken(access_token);
      logger.info('Access token saved successfully');
    } else {
      logger.warn(`Access token is missing or empty in ${isAdmin ? 'admin ' : ''}login response`);
      throw new Error('Access token is required but was not provided');
    }

    // Save refresh token separately if present and non-empty
    if (refresh_token && typeof refresh_token === 'string' && refresh_token.trim().length > 0) {
      await offlineStorage.create(STORAGE_KEYS.AUTH_REFRESH_TOKEN, refresh_token);
      logger.info('Refresh token saved successfully');
    }

    // Save user data to offline storage (will be overwritten by AuthContext with mapped user)
    if (user) {
      await offlineStorage.create(STORAGE_KEYS.AUTH_USER, user);
      logger.info('User data saved to storage');
    }

    return responseData;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};


export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await api.get(API_ENDPOINTS.USER_PROFILE);
    return response.data.result || {};
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};