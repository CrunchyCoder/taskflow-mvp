import React from 'react';
import DropZone from '../common/DropZone';
import TimeDisplay from '../common/TimeDisplay';
import TaskList from '../tasks/TaskList';

const TodayQueue = ({ 
  todoQueue, 
  onToggle, 
  onRemoveFromQueue, 
  onUpdateTime, 
  onUpdateNotes,
  onUpdateName,
  onDragStart, 
  onDragEnd, 
  onDrop 
}) => {
  return (
    <DropZone onDrop={onDrop} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          📋 Today's Queue
        </h2>
        <span className="text-sm text-gray-500">
          {todoQueue.length} tasks
        </span>
      </div>

      {todoQueue.length > 0 && (
        <TimeDisplay tasks={todoQueue} title="⏰ Today's Schedule" />
      )}

      {todoQueue.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-lg">No tasks queued for today</p>
          <p className="text-sm">Drag tasks here or use the Queue button</p>
        </div>
      ) : (
        <TaskList
          items={todoQueue}
          onToggle={onToggle}
          onQueue={onRemoveFromQueue}
          onUpdateTime={onUpdateTime}
          onUpdateNotes={onUpdateNotes}  // Add if missing
          onUpdateName={onUpdateName}    // Add this line
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isQueue
          showProject
        />
      )}
    </DropZone>
  );
};

export default TodayQueue;