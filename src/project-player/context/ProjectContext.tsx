import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { ProjectData, Task } from '../types/project.types';
import {
  ProjectContextValue,
  ProjectProviderProps,
} from '../types/components.types';
import { setApiConfig } from '../utils/api';

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined,
);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  config,
  initialData,
}) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(
    initialData,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize API configuration
  useEffect(() => {
    if (config.baseUrl || config.accessToken) {
      setApiConfig({
        baseUrl: config.baseUrl,
        accessToken: config.accessToken,
      });
    }
  }, [config.baseUrl, config.accessToken]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setProjectData(prev => {
      if (!prev) return null;

      // Recursive function to update task in nested structure
      const updateTaskRecursive = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task._id === taskId) {
            console.log(
              'Found task to update:',
              task.name,
              'new status:',
              updates.status,
            );
            return { ...task, ...updates };
          }
          if (task.children) {
            return {
              ...task,
              children: updateTaskRecursive(task.children),
            };
          }
          return task;
        });
      };

      const updatedData = {
        ...prev,
        tasks: updateTaskRecursive(prev.tasks),
      };
      return updatedData;
    });
  }, []);

  const updateProjectInfo = useCallback((updates: Partial<ProjectData>) => {
    setProjectData(prev => (prev ? { ...prev, ...updates } : null));
  }, []);

  const addTask = useCallback((task: Task) => {
    // TODO: Implement add task logic
    console.log('addTask', task);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    // TODO: Implement delete task logic
    console.log('deleteTask', taskId);
  }, []);

  const saveLocal = useCallback(() => {
    // TODO: Implement local save logic
    console.log('saveLocal');
  }, []);

  const syncToServer = useCallback(async () => {
    // TODO: Implement sync logic
    console.log('syncToServer');
  }, []);

  const value: ProjectContextValue = {
    projectData,
    isLoading,
    error,
    mode: config.mode,
    config, // Provide full config to child components
    updateTask,
    updateProjectInfo,
    addTask,
    deleteTask,
    saveLocal,
    syncToServer,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
