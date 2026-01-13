import { useState, useEffect } from 'react';
import { ProjectData } from '../types/project.types';
import {
  ProjectPlayerConfig,
  ProjectPlayerData,
} from '../types/components.types';
import {
  createProjectForEntity,
  getProjectDetails,
  getTaskDetails,
} from '../services/projectPlayerService';
import { STATUS } from '@constants/app.constant';
import { updateEntityDetails } from '../../../src/services/participantService';

export const useProjectLoader = (
  config: ProjectPlayerConfig,
  data: ProjectPlayerData,
) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // config.mode = "edit" and data contains  projectId.
        if (config.mode === 'edit') {
          const { entityId, projectId, userStatus } = data;

          if (!entityId || userStatus !== STATUS.NOT_ENROLLED) return;

          try {
            let projectData;

            if (projectId) {
              const res = await getProjectDetails(projectId);
              projectData = res.data;
            } else {
              const res = await createProjectForEntity(entityId);
              projectData = res.data;

              if (projectData?._id) {
                await updateEntityDetails(entityId, {
                  'metaInformation.onBoardingProjectId': projectData._id,
                });
              }
            }
            if (error) {
              throw new Error(error);
            }

            setProjectData(projectData);
          } catch (err) {
            console.error('Failed to load project templates:', err);
            setProjectData(null);
            setError(err as Error);
          }
        } else if (config.mode === 'preview' && data?.categoryIds) {
          const categoryIdsString = data?.categoryIds.join(',');
          const taskResponse = await getTaskDetails(categoryIdsString);
          const taskResult = taskResponse.data;
          // const taskData = normalizeTaskResponse(taskResult);
          // console.log('taskData', taskData);
          // ✅ ENRICH — not replace
          // const enrichedChildren = enrichChildrenWithProjects(
          //   templateDetails.data.children,
          //   taskData,
          // );
          // // ✅ final combined response
          // const finalProjectData = {
          //   ...templateDetails.data,
          //   children: enrichedChildren,
          // };
          setProjectData(taskResult);
        } else if (data.solutionId) {
          // Load template
          // TODO: Implement API call
          // const response = await fetch(`/api/template/details/${data.solutionId}`);
          // For now, set to null until API is implemented
          setProjectData(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [config.mode, data.projectId, data.solutionId, data.data]);

  return { projectData, isLoading, error };
};
