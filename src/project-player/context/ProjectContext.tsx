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
import { MODE } from '@constants/PROJECTDATA';

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

  const isEditMode = config.mode === MODE.editMode.mode;

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
      let currentProjectId: string | null = null;

      // Update local state first (optimistic update)
      setProjectData(prev => {
        if (!prev) return null;

        currentProjectId = prev._id;

        // Recursive function to update task in nested structure
        const updateTaskRecursive = (tasks: Task[]): Task[] => {
          return tasks.map(task => {
            if (task._id === taskId) {
              const newTask = { ...task, ...updates };
              updatedTaskObj = newTask;
              return newTask;
            }
            if (task.tasks && task.tasks.length > 0) {
              return {
                ...task,
                tasks: updateTaskRecursive(task.tasks),
              };
            }
            return task;
          });
        };

        if (prev.children?.length) {
          return {
            ...prev,
            children: updateTaskRecursive(prev.children),
          };
        } else if (prev?.tasks?.some(task => task.children?.length)) {
          return {
            ...prev,
            tasks: prev.tasks.map(task => ({
              ...task,
              children: task.children
                ? updateTaskRecursive(task.children)
                : task.children,
            })),
          };
        }

        return {
          ...prev,
          tasks: updateTaskRecursive(prev.tasks || []),
        };
      });
      // ✅ Notify parent after state update
      if (onTaskUpdate) {
        setTimeout(() => {
          if (updatedTaskObj) onTaskUpdate(updatedTaskObj);
        }, 0);
      }
      // ✅ If custom task → DO NOT call API
      // if (!updatedTaskObj || updatedTaskObj?.isCustomTask) {
      //   return;
      // }

      // Call API to update task on server
      if (currentProjectId) {
        try {
           if (updatedTaskObj?.isCustomTask && !isEditMode) {
              return;
           }
          else if ((updatedTaskObj?.isCustomTask || updatedTaskObj?.parentId) && isEditMode ) {
            updateTaskAPI(currentProjectId, {
              tasks: [
                {
                  _id: updatedTaskObj?.parentId,
                  name: updates.pillarName,
                  children: [
                    { _id: taskId, name: updatedTaskObj?.name, ...updates },
                  ],
                },
              ],
            });
          } else {
            updateTaskAPI(currentProjectId, {
              tasks: [
                {
                  _id: taskId,
                  name: updatedTaskObj?.name,
                  ...updates,
                },
              ],
            });
          }
        } catch (error) {
          console.log(error);
        }
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
      const  currentProjectId = prev._id;
      // Recursive function to find pillar and add task to its children
      const addTaskToPillar = (tasks: Task[]): Task[] => {
        return tasks.map(t => {
          if (t._id === pillarId) {
            if (t?.children && t?.children.length) {
              if (currentProjectId) {
                // (async () => {
                try {
                  updateTaskAPI(currentProjectId, {
                    // tasks: [task],
                    tasks: [
                      {
                        _id: pillarId,
                        name: t.name,
                        children:[task],
                      },
                    ],
                  });
                } catch (error) {
                  console.log(error);
                }
              // })
              }
              return {
                ...t,
                children: [...(t.children || []), task],
              };
            } else {
              return {
                ...t,
                tasks: [...(t.tasks || []), task],
              };
            }
          }
          if (t.tasks && t.tasks.length > 0) {
            return {
              ...t,
              tasks: addTaskToPillar(t.tasks),
            };
          }         
          return t;
        });
      };

      if (prev.tasks?.length) {
        return {
          ...prev,
          tasks: addTaskToPillar(prev.tasks),
        };
      } else{
        return {
          ...prev,
          children: addTaskToPillar(prev?.children || []),
        };
      }
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
  setProjectData(prev => {
    if (!prev) return null;
    const currentProjectId = prev._id;

    let deletedTask: Task | null = null;
    let parentId: string | null = null;
    let parentName: string | null = null;

    const findTaskInfo = (tasks: Task[], parent?: Task) => {
      for (const task of tasks) {
        if (task._id === taskId) {
          deletedTask = task;
          parentId = parent?._id || null;
          parentName = parent?.name || null;
          return true;
        }
        if (task.tasks?.length && findTaskInfo(task.tasks, task)) return true;
        if (task.children?.length && findTaskInfo(task.children, task)) return true;
      }
      return false;
    };

    findTaskInfo(prev.tasks || prev.children || []);

    if (currentProjectId && deletedTask && parentId && isEditMode) {
      updateTaskAPI(currentProjectId, {
        tasks: [
          {
            _id: parentId,
            name:parentName,
            children: [{ _id: deletedTask._id, isDeleted: true }],
          },
        ],
      }).catch(console.log);
    }

    // 🧹 Step 3: Remove task from state
    const deleteRecursive = (tasks: Task[]): Task[] =>
      tasks
        .filter(task => task._id !== taskId)
        .map(task => ({
          ...task,
          tasks: task.tasks ? deleteRecursive(task.tasks) : task.tasks,
          children: task.children
            ? deleteRecursive(task.children)
            : task.children,
        }));

    if (prev?.tasks?.some(task => task.children?.length)) {
      return {
        ...prev,
        tasks: prev.tasks.map(task => ({
          ...task,
          children: task.children
            ? deleteRecursive(task.children)
            : task.children,
        })),
      };
    }

    if (prev.children?.length) {
      return {
        ...prev,
        children: deleteRecursive(prev.children),
      };
    }

    return {
      ...prev,
      tasks: deleteRecursive(prev.tasks || []),
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
