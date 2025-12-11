import React from 'react';
import { Box, VStack, Card, ScrollView } from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInfoCard from './ProjectInfoCard';
import TaskComponent from './TaskComponent';
// import AddCustomTask from '../Task/AddCustomTask';
import { projectComponentStyles } from './Styles';

const ProjectComponent: React.FC = () => {
  const { projectData } = useProjectContext();
  // mode
  if (!projectData) {
    return null;
  }

  // const isEditMode = mode === 'edit';

  return (
    <Box {...projectComponentStyles.container}>
      <ScrollView {...projectComponentStyles.scrollView}>
        <Card {...projectComponentStyles.card}>
          <VStack>
            <ProjectInfoCard project={projectData} />

            {projectData.tasks?.map((task, index) => (
              <TaskComponent
                key={task._id}
                task={task}
                isLastTask={index === projectData.tasks.length - 1}
              />
            ))}

            {/* {isEditMode && (
              <Box {...projectComponentStyles.addTaskButtonContainer}>
                <AddCustomTask />
              </Box>
            )} */}
          </VStack>
        </Card>
      </ScrollView>
    </Box>
  );
};

export default ProjectComponent;
