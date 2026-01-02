import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import logger from '@utils/logger';
import { login as loginService } from '../services/authenticationService';
import offlineStorage from '../services/offlineStorage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import { getToken, removeToken } from '../services/api';
import { ADMIN_ROLES, LC_ROLES } from '@constants/ROLES';

export type UserRole = 'Admin' | 'Supervisor' | 'LC';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  languages?: string[] | null;
  [key: string]: any; // Allow additional user properties from API
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Determines user role based on organizations and roles.
 * Checks admin roles first (priority), then LC roles.
 * Throws error if user doesn't have any authorized role.
 * @param userData - User data from API response
 * @returns UserRole based on role priority (Admin > LC)
 * @throws Error if user doesn't have any authorized role
 */
const determineUserRole = (userData: any): UserRole => {

  // Check for admin roles first (priority)
  const adminOrganizations = userData.organizations.filter((org: any) => {
    if (!org?.roles || !Array.isArray(org.roles)) {
      return false;
    }
    return org.roles.some((role: any) => 
      ADMIN_ROLES.includes(role?.title)
    );
  });

  if (adminOrganizations.length > 0) {
    logger.info('User has admin role based on organizations');
    return 'Admin';
  }

  // Check for LC roles
  const lcOrganizations = userData.organizations.filter((org: any) => {
    if (!org?.roles || !Array.isArray(org.roles)) {
      return false;
    }
    return org.roles.some((role: any) => 
      LC_ROLES.includes(role?.title)
    );
  });

  if (lcOrganizations.length > 0) {
    logger.info('User has LC role based on organizations');
    return 'LC';
  }

  // If no matching roles found in organizations, throw unauthorized error
  throw new Error('Unauthorized: This role is not authorized to access the system');
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check for both user data and token
        // Both must exist for user to be considered logged in
        const [storedUser, token] = await Promise.all([
          offlineStorage.read<User>(STORAGE_KEYS.AUTH_USER),
          getToken(),
        ]);

        // Validate that user object has required fields and token exists
        const isValidUser = storedUser && 
          typeof storedUser === 'object' && 
          Object.keys(storedUser).length > 0 &&
          (storedUser.id || storedUser.email); // At least one identifier should exist

        // Only set logged in if both user and token exist and user is valid
        if (isValidUser && token) {
          setUser(storedUser);
          setIsLoggedIn(true);
          logger.info('User session restored from storage:', storedUser.email || storedUser.id);
        } else {
          // If either is missing or invalid, clear everything to ensure clean state
          if (storedUser && !token) {
            logger.warn('User data found but no token - clearing user data');
          } else if (token && !isValidUser) {
            logger.warn('Token found but invalid user data - clearing auth data');
          }
          
          // Clear all auth data
          await offlineStorage.remove(STORAGE_KEYS.AUTH_USER);
          await offlineStorage.remove(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
          if (token) {
            await removeToken();
          }
          
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        logger.error('Error loading user from storage:', error);
        // On error, ensure clean state
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string, isAdmin: boolean = false): Promise<boolean> => {
    try {
      if (!email || !password) {
        logger.warn(`${isAdmin ? 'Admin ' : ''}Login attempted with empty credentials`);
        return false;
      }

      // Call the authentication service with the isAdmin flag
      const loginResponse = await loginService(email, password, isAdmin);

      // Check if login response has user data
      if (loginResponse.result?.user) {
        const userData = loginResponse.result.user;
        // Determine user role (admin priority), throws if unauthorized
        let determinedRole: UserRole;
        try {
          determinedRole = determineUserRole(userData);
        } catch (roleError: any) {
          logger.warn(`${isAdmin ? 'Admin ' : ''}User role not authorized:`, roleError.message);
          throw new Error(roleError.message || 'Unauthorized: This role is not authorized to access the system');
        }
        
        // Map API user data to User interface
        const mappedUser: User = {
          role: determinedRole,
          ...userData, // Include any additional properties from API
        };

        // Save the mapped user data to storage in one line
        await offlineStorage.create(STORAGE_KEYS.AUTH_USER, mappedUser);
        
        // Update the context state
        setUser(mappedUser);
        setIsLoggedIn(true);
        
        logger.info(`${isAdmin ? 'Admin ' : ''}User logged in successfully:`, mappedUser.email || mappedUser.id);
        return true;
      } else {
        logger.warn(`${isAdmin ? 'Admin ' : ''}Login failed:`, loginResponse.message || 'No user data in response');
        return false;
      }
    } catch (error: any) {
      // @ts-ignore - Allow throwing error (so UI can show the error message)
      logger.error(`${isAdmin ? 'Admin ' : ''}Login error:`, error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Remove tokens
      await removeToken();
      
      // Remove user data from storage
      await offlineStorage.remove(STORAGE_KEYS.AUTH_USER);
      await offlineStorage.remove(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
      
      // Clear context state
      setUser(null);
      setIsLoggedIn(false);
      
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, setIsLoggedIn, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
