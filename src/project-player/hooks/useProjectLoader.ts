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
import { getProjectCategoryList } from '../../../src/services/projectService';
import { useAuth } from '@contexts/AuthContext';

export const useProjectLoader = (
  config: ProjectPlayerConfig,
  data: ProjectPlayerData,
) => {
  const {user} = useAuth();
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


          try {
            let projectData;

            if (projectId) {
              const res = await getProjectDetails(projectId);
              projectData = res.data;
            } else {
              try {
                 const projectData = await createProjectForEntity(entityId);

              if (projectData?._id) {
                await updateEntityDetails({
                  userId: `${user?.id}`,
                  programId: process.env.GLOBAL_LC_PROGRAM_ID,
                  entityId:entityId,
                 entityUpdates:{
                   onBoardedProjectId: projectData._id,
                 }
                });
              }
              } catch (error) {
                console.log(error)
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
          const templatesData = await getProjectCategoryList();
          const selectedPathway = data?.selectedPathway;
          const pathwayData = templatesData?.find(
            (template: any) => template._id === selectedPathway,
          );
          const categoryIdsString = data?.categoryIds.join(',');
          const taskResponse = await getTaskDetails(categoryIdsString);
          const taskResult = taskResponse.data;

          const updatedPathwayData = {
            ...pathwayData,
            children: pathwayData?.children?.map((child: any) => {
              let taskEntry = taskResult?.[child._id];

              if (!taskEntry) {
                const relation = data?.pillarCategoryRelation?.find(
                  (rel: any) => rel.pillarId === child._id,
                );

                const newChildId = relation?.selectedCategoryId;
                if (newChildId) {
                  taskEntry = taskResult?.[newChildId];
                }
              }

              // 3️⃣ Normalize tasks safely
              const tasks = Array.isArray(taskEntry)
                ? taskEntry?.[0]?.tasks ?? []
                : taskEntry?.tasks ?? [];

                const templateId = taskEntry?.[0]?._id

              return {
                ...child,
                tasks,
                templateId
              };
            }),
          };

          console.log(updatedPathwayData);

          setProjectData(updatedPathwayData);
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
