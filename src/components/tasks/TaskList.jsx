import React from 'react';
import DraggableTask from '../common/DraggableTask';
import TaskItem from './TaskItem';

const TaskList = ({ 
  items, 
  onToggle, 
  onQueue, 
  onUpdateTime, 
  onDragStart, 
  onDragEnd, 
  isQueue = false, 
  showProject = false 
}) => {
  return (
    <ul className="space-y-3">
      {items.map(item => (
        <DraggableTask 
          key={item.id} 
          id={item.id}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <TaskItem
            task={item}
            onToggle={onToggle}
            onQueue={onQueue}
            onUpdateTime={onUpdateTime}
            isQueue={isQueue}
            showProject={showProject}
          />
        </DraggableTask>
      ))}
    </ul>
  );
};

export default TaskList;