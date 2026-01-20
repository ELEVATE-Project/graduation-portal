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
import { updateTask as updateTaskAPI } from '../services/projectPlayerService';

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
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  // Initialize API configuration
  useEffect(() => {
    if (config.baseUrl || config.accessToken) {
      setApiConfig({
        baseUrl: config.baseUrl,
        accessToken: config.accessToken,
      });
    }
  }, [config.baseUrl, config.accessToken]);

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      let updatedTaskObj: Task | null = null;
      let projectId: string | null = null;

      // Update local state first (optimistic update)
      setProjectData(prev => {
        if (!prev) return null;

        projectId = prev._id;

        // Recursive function to update task in nested structure
        const updateTaskRecursive = (tasks: Task[]): Task[] => {
          return tasks.map(task => {
            if (task._id === taskId) {
              const newTask = { ...task, ...updates };
              updatedTaskObj = newTask;
              return newTask;
            }
            if (task.children && task.children.length > 0) {
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
          tasks: updateTaskRecursive(prev.tasks || []),
        };

        return updatedData;
      });

      // Call onTaskUpdate callback if provided
      if (onTaskUpdate && updatedTaskObj) {
        setTimeout(() => onTaskUpdate(updatedTaskObj!), 0);
      }

      // Call API to update task on server
      if (projectId && updatedTaskObj) {
        updateTaskAPI(projectId, {
          tasks: [
            {
              _id: taskId,
              ...updates,
            },
          ],
        })
          .then(response => {
            if (response.error) {
              console.error('Failed to update task on server:', response.error);
              // Optionally revert local state on error or show error message
            } else {
              console.log(
                'Task updated successfully on server:',
                response.data,
              );
            }
          })
          .catch(apiError => {
            console.error('Error updating task on server:', apiError);
            // Optionally revert local state on error or show error message
          });
      }
    },
    [onTaskUpdate],
  );

  const updateProjectInfo = useCallback((updates: Partial<ProjectData>) => {
    setProjectData(prev => (prev ? { ...prev, ...updates } : null));
  }, []);

  const addTask = useCallback((pillarId: string, task: Task) => {
    setProjectData(prev => {
      if (!prev) return null;

      // Recursive function to find pillar and add task to its children
      const addTaskToPillar = (tasks: Task[]): Task[] => {
        return tasks.map(t => {
          if (t._id === pillarId && t.type === 'project') {
            // Found the pillar, add task to its children
            return {
              ...t,
              children: [...(t.children || []), task],
            };
          }
          if (t.children && t.children.length > 0) {
            // Keep searching in children
            return {
              ...t,
              children: addTaskToPillar(t.children),
            };
          }
          return t;
        });
      };

      return {
        ...prev,
        tasks: addTaskToPillar(prev.tasks || []),
      };
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setProjectData(prev => {
      if (!prev) return null;

      // Recursive function to remove task from anywhere in the tree
      const deleteTaskRecursive = (tasks: Task[]): Task[] => {
        return tasks
          .filter(task => task._id !== taskId) // Remove if matches
          .map(task => {
            if (task.children && task.children.length > 0) {
              // Recursively delete from children
              return {
                ...task,
                children: deleteTaskRecursive(task.children),
              };
            }
            return task;
          });
      };

      return {
        ...prev,
        tasks: deleteTaskRecursive(prev.tasks || []),
      };
    });
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
