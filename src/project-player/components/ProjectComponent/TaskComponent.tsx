import React from 'react';
import TaskCard from '../Task/TaskCard';
import ProjectAsTaskComponent from './ProjectAsTaskComponent';
import { TaskComponentProps } from '../../types/components.types';

const TaskComponent: React.FC<TaskComponentProps> = ({
  task,
  level = 0,
  isLastTask = false,
  isChildOfProject = false, // New prop
}) => {
  // If task is a project type with children, render as ProjectAsTaskComponent
  if (task?.type === 'project' && task?.children && task?.children.length > 0) {
    return <ProjectAsTaskComponent task={task} level={level} />;
  }

  // Otherwise render as a regular task card
  return (
    <TaskCard
      task={task}
      level={level}
      isLastTask={isLastTask}
      isChildOfProject={isChildOfProject} // Pass down the prop
    />
  );
};

export default TaskComponent;
