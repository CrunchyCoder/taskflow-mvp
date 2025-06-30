import React, { useState } from 'react';
import { formatTime, getPriorityColor } from '../../utils/helpers';

const TaskItem = ({ 
  task, 
  onToggle, 
  onQueue, 
  onUpdateTime, 
  isQueue = false, 
  showProject = false 
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempTime, setTempTime] = useState(task.estimatedTime || '');

  const handleTimeUpdate = () => {
    const time = parseInt(tempTime) || 0;
    onUpdateTime(task.id, time);
    setIsEditingTime(false);
  };

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <span className={`text-lg ${task.done ? "line-through text-gray-400" : "text-gray-800"}`}>
            {task.text}
          </span>
          {showProject && (
            <div className="text-sm text-gray-500 mt-1">
              📁 {task.projectName}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isEditingTime ? (
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
                placeholder="mins"
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                onKeyDown={(e) => e.key === 'Enter' && handleTimeUpdate()}
                autoFocus
              />
              <button
                onClick={handleTimeUpdate}
                className="text-xs text-green-600 hover:text-green-800"
              >
                ✓
              </button>
              <button
                onClick={() => setIsEditingTime(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                ✗
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTime(true)}
              className="flex items-center text-xs text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-2 py-1 rounded"
            >
              ⏱️ {task.estimatedTime ? formatTime(task.estimatedTime) : 'Add time'}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => onQueue(task.id)}
            className={`px-3 py-1 rounded-full border transition ${
              isQueue 
                ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100" 
                : "border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100"
            }`}
          >
            {isQueue ? "✖ Remove" : "➕ Queue"}
          </button>
          <button
            onClick={() => onToggle(task.id)}
            className="px-3 py-1 rounded-full border border-green-300 text-green-600 bg-green-50 hover:bg-green-100 transition"
          >
            {task.done ? "Undo" : "Done"}
          </button>
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;