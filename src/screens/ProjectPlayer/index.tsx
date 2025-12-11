import React from 'react';
import Project from '../../project-player/index';
import { ProjectPlayerData } from '../../project-player/types/components.types';
import {
  COMPLEX_PROJECT_DATA,
  DUMMY_PROJECT_DATA,
  PROJECT_PLAYER_CONFIGS,
} from '../../constants/PROJECTDATA';

const ProjectPlayer = () => {
  const config = PROJECT_PLAYER_CONFIGS.editMode;
  // const config = PROJECT_PLAYER_CONFIGS.previewMode; // For preview mode
  // const config = PROJECT_PLAYER_CONFIGS.readOnlyMode; // For read-only mode

  const data: ProjectPlayerData = {
    solutionId: config.solutionId,
    projectId: config.projectId,
    localData: DUMMY_PROJECT_DATA,
  };

  return <Project config={config} data={data} />;
};

export default ProjectPlayer;
