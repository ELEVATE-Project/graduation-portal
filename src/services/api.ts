import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '@utils/logger';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
// import { API_BASE_URL, ORIGIN } from '@config/env';
import offlineStorage from './offlineStorage';
import { isAndroid } from '@utils/platform';

// Type declaration for process.env (injected by webpack DefinePlugin on web, available in React Native)
declare const process:
  | {
      env: {
        [key: string]: string | undefined;
      };
    }
  | undefined;

const TOKEN_STORAGE_KEY = STORAGE_KEYS.AUTH_TOKEN;
const INTERNAL_ACCESS_TOKEN_KEY = STORAGE_KEYS.INTERNAL_ACCESS_TOKEN;

/**
 * Create axios instance with base configuration
 * baseURL is loaded from .env file via @config/env
 */

const api: AxiosInstance = axios.create({
  // @ts-ignore - process.env is injected by webpack DefinePlugin on web, available in React Native
  baseURL: process.env.API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'internal-access-token': '9yG*tM*y(7)',
    // @ts-ignore - process.env is injected by webpack DefinePlugin on web
    ...(!isAndroid ? {} : { origin: process.env.ORIGIN || '' }),
  },
});

/**
 * Request Interceptor
 * Adds authentication token to requests and handles other request details
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get token from storage
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

      // Add token to Authorization header if available
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['x-auth-token'] = token;
      }

      // Add internal-access-token header if available - Required for entity-management API endpoints
      const internalAccessToken = await AsyncStorage.getItem(INTERNAL_ACCESS_TOKEN_KEY);
      if (internalAccessToken && config.headers) {
        config.headers['internal-access-token'] = internalAccessToken;
      }

      // Log request details (optional - can be removed in production)
      // logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      //   headers: config.headers,
      //   data: config.data,
      // });

      return config;
    } catch (error) {
      logger.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * Handles response data, errors, and token refresh logic
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response (optional)
    logger.info(
      `API Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`,
      {
        status: response.status,
        data: response.data,
      },
    );

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear stored token and user data to force re-login
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);

        // Clear user data from offline storage
        await offlineStorage.remove(STORAGE_KEYS.AUTH_USER);
        await offlineStorage.remove(STORAGE_KEYS.AUTH_REFRESH_TOKEN);

        // Log out user or redirect to login
        logger.warn('Session expired. User needs to login again.');

        // Note: AuthContext will detect missing token/user on next check/reload
        // and automatically redirect to login screen

        return Promise.reject(error);
      } catch (storageError) {
        logger.error('Error clearing authentication data:', storageError);
        return Promise.reject(error);
      }
    }

    // Handle other error status codes
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      logger.error(
        `API Error: ${status} - ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        {
          status,
          message: data?.message || error.message,
          data,
        },
      );

      // Return a more user-friendly error message
      const errorMessage =
        data?.message || `Request failed with status ${status}`;
      return Promise.reject(new Error(errorMessage));
    }

    // Handle network errors
    if (error.request) {
      logger.error('Network error - No response received:', error.message);
      return Promise.reject(
        new Error('Network error. Please check your connection.'),
      );
    }

    // Handle other errors
    logger.error('Request setup error:', error.message);
    return Promise.reject(error);
  },
);

/**
 * Helper function to save token
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    logger.error('Error saving token:', error);
    throw error;
  }
};

/**
 * Helper function to get token
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    logger.error('Error getting token:', error);
    return null;
  }
};

/**
 * Helper function to remove token
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    logger.error('Error removing token:', error);
    throw error;
  }
};

export default api;
