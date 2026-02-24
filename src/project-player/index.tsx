import React, { useEffect } from 'react';
import { ProjectProvider, useProjectContext } from './context/ProjectContext';
import { useProjectLoader } from './hooks/useProjectLoader';
import ProjectComponent from './components/ProjectComponent';
import { Box, Spinner } from '@gluestack-ui/themed';
import {
  ProjectPlayerProps,
  ProjectPlayerConfig,
  ProjectPlayerData,
} from './types/components.types';
import { areAllTasksCompleted } from './utils/taskCompletionUtils';

export type { ProjectPlayerConfig, ProjectPlayerData };

/**
 * Internal component that tracks task completion and calls callback
 */
const TaskCompletionTracker: React.FC<{
  onTaskCompletionChange?: (areAllCompleted: boolean) => void;
}> = ({ onTaskCompletionChange }) => {
  const { projectData } = useProjectContext();

  useEffect(() => {
    if (projectData?.tasks && onTaskCompletionChange) {
      const allCompleted = areAllTasksCompleted(projectData.tasks);
      onTaskCompletionChange(allCompleted);
    }
  }, [projectData?.tasks, onTaskCompletionChange]);

  return null; // This component doesn't render anything
};

const ProjectPlayer: React.FC<ProjectPlayerProps> = ({
  config,
  data,
  onTaskUpdate,
  onTaskCompletionChange,
}) => {
  const {
    projectData: loadedProject,
    isLoading,
    error,
  } = useProjectLoader(config, data ?? {});

  if (isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        {/* TODO: Add error component */}
      </Box>
    );
  }

  return (
    <ProjectProvider
      config={config}
      initialData={loadedProject}
      onTaskUpdate={onTaskUpdate}
    >
      <TaskCompletionTracker onTaskCompletionChange={onTaskCompletionChange} />
      <ProjectComponent />
    </ProjectProvider>
  );
};

export default ProjectPlayer;
