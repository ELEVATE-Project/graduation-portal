import axios from 'axios';
import { PROJECT_PLAYER_CONFIGS } from '../../constants/PROJECTDATA';
import { ApiResponse } from '../types/components.types';
import { API_ENDPOINTS } from './apiEndpoints';
import { isWeb } from '@utils/platform';
import { createProjectPlanPayload } from '../types';

export const apiClient = axios.create({
  // Use baseUrl from PROJECT_PLAYER_CONFIGS (which gets from env, with fallback)
  baseURL: PROJECT_PLAYER_CONFIGS.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async config => {
  // Get token from PROJECT_PLAYER_CONFIGS.accessToken (which fetches from AsyncStorage)
  try {
    const token = await PROJECT_PLAYER_CONFIGS.accessToken();
    if (token) {
      config.headers['X-auth-token'] = token;
    }
  } catch (error) {
    console.error(
      'Error getting token from AsyncStorage in interceptor:',
      error,
    );
    // No token will be added if AsyncStorage fails
  }

  return config;
});

apiClient.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      const redirectUrl =
        PROJECT_PLAYER_CONFIGS.redirectionLinks.unauthorizedRedirectUrl;

      if (isWeb) {
        window.location.href = redirectUrl;
      } else {
        const routeName = redirectUrl.startsWith('/')
          ? redirectUrl.slice(1)
          : redirectUrl;
      }
    }
    return Promise.reject(error);
  },
);

export const handleApiError = (error: unknown): ApiResponse<null> => {
  if (axios.isAxiosError(error)) {
    return {
      data: null,
      error: error.response
        ? `HTTP ${error.response.status}: ${error.response.statusText}`
        : error.message,
    };
  }

  return {
    data: null,
    error: error instanceof Error ? error.message : 'Unknown error occurred',
  };
};

export const getProjectTemplatesList = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PROJECT_TEMPLATES_LIST);

    return { data: response.data.result };
  } catch (error) {
    return handleApiError(error);
  }
};

export const createProjectForEntity = async (
  entityId: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CREATE_PROJECT, {
      entityId,
    });

    return  response.data.result ;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getProjectDetails = async (
  projectID: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.PROJECT_DETAILS(projectID),
    );

    return { data: response.data.result };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateTask = async (
  projectId: string,
  requestBody: any,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.UPDATE_TASK(projectId),
      requestBody,
    );

    return { data: response };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCategoryList = async (
  parentId: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.GET_CATEGORY_LIST(parentId),
    );
    return { data: response.data.result };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTemplateDetails = async (
  categoryId: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.GET_TEMPLATE(categoryId),
    );
    // const resData = templateDetailsAPIMockResponse;
    return { data: response.data.result };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getTaskDetails = async (
  categoryIds: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.GET_TASK_DETAILS(categoryIds),
    );
    // const response = taskDetailsAPIMockResponse;
    return { data: response.data.result };
  } catch (error) {
    return handleApiError(error);
  }
};

export const submitInterventionPlan = async (
  reqBody : createProjectPlanPayload
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBMIT_INTERVENTION_PLAN, reqBody,
    );

    return { data: response.data.result || response.data };
  } catch (error) {
    return handleApiError(error);
  }
};
