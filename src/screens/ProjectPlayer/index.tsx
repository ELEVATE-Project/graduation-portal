import React, { ReactElement } from 'react';
import Project, {
  ProjectPlayerConfig,
  ProjectPlayerData,
} from '../../project-player/index';


type ProjectPlayerProps = {
  config: ProjectPlayerConfig;
  data: ProjectPlayerData;
};

export const ProjectPlayer = ({
  config,
  data,
}: ProjectPlayerProps): ReactElement => {
  return <Project config={config} data={data} />;
};

export default ProjectPlayer;
