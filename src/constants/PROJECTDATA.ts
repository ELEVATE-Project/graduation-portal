import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './STORAGE_KEYS';

declare const process:
  | {
      env: {
        [key: string]: string | undefined;
      };
    }
  | undefined;

const baseUrl = process.env.API_BASE_URL;

// Helper function to get access token from AsyncStorage
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return null;
  }
};

export const PROJECT_PLAYER_CONFIGS = {
  maxFileSize: 50,
  baseUrl: baseUrl,
  accessToken: getAccessToken,
  language: 'en',
  profileInfo: {
    id: 123,
    name: 'John Doe',
  },
  redirectionLinks: {
    unauthorizedRedirectUrl: '/login',
  },
};

export const MODE = {
  // Edit mode with full permissions
  editMode: {
    mode: 'edit' as const,
  },
  // Preview mode (template view)
  previewMode: {
    mode: 'preview' as const,
  },

  // Read-only mode
  readOnlyMode: {
    mode: 'read-only' as const,
  },
};
