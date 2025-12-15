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
  onTaskUpdate,
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
    let updatedTaskObj: Task | null = null;

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
            const newTask = { ...task, ...updates };
            updatedTaskObj = newTask;
            return newTask;
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

      // Notify parent if callback provided
      // Note: This runs synchronously within the setState callback, 
      // but we shouldn't trigger side effects here usually. 
      // However, for this simple case it's the easiest way to access the new object.
      // Better pattern: use useEffect or separate extraction, but we need the found object.
      if (onTaskUpdate && updatedTaskObj) {
        // modifying state during render of another component (if parent updates state) is bad.
        // But here we are in an event handler (updateTask called from button click), so it's fine.
        setTimeout(() => onTaskUpdate(updatedTaskObj!), 0);
      }

      return updatedData;
    });
  }, [onTaskUpdate]);

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
    onTaskUpdate,
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
