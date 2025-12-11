import React from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { useProjectLoader } from './hooks/useProjectLoader';
import ProjectComponent from './components/ProjectComponent';
import { Box, Spinner } from '@gluestack-ui/themed';
import {
  ProjectPlayerProps,
  ProjectPlayerConfig,
  ProjectPlayerData,
} from './types/components.types';

export type { ProjectPlayerConfig, ProjectPlayerData };

const ProjectPlayer: React.FC<ProjectPlayerProps> = ({ config, data }) => {
  const {
    projectData: loadedProject,
    isLoading,
    error,
  } = useProjectLoader(config, data ?? {});

  console.log('ProjectPlayerData', loadedProject);
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
    <ProjectProvider config={config} initialData={loadedProject}>
      <ProjectComponent />
    </ProjectProvider>
  );
};

export default ProjectPlayer;
