import React from 'react';
import Project, {
  ProjectPlayerConfig,
  ProjectPlayerData,
} from '../../project-player/index';
// import { ProjectPlayerData } from '../../project-player/types/components.types';
import // MODE,
// COMPLEX_PROJECT_DATA,
// DUMMY_PROJECT_DATA,
// PROJECT_PLAYER_CONFIGS,
'../../constants/PROJECTDATA';

const ProjectPlayer = (
  config: ProjectPlayerConfig,
  data: ProjectPlayerData,
) => {
  // const config = PROJECT_PLAYER_CONFIGS;
  // const selectedMode = MODE.editMode;
  // const selectedMode = PROJECT_PLAYER_CONFIGS.previewMode;
  // const selectedMode = PROJECT_PLAYER_CONFIGS.readOnlyMode;

  const projectConfig = { ...config };
  const projectData = { ...data };
  // const data: ProjectPlayerData = {
  //   solutionId: config.data.solutionId,
  //   projectId: config.data.projectId,
  // data: {},
  // };

  return <Project config={projectConfig.config} data={projectConfig.data} />;
};

export default ProjectPlayer;
