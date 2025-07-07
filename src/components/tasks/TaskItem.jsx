import React, { useState, useEffect } from 'react';
import { formatTime, getPriorityColor } from '../../utils/helpers';

// Enhanced time comparison utility
const getTimeComparison = (actualTime, estimatedTime) => {
  if (!actualTime && !estimatedTime) {
    return { 
      status: 'no-data',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      indicator: '⚪'
    };
  }
  
  if (!estimatedTime) {
    return { 
      status: 'no-estimate',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      indicator: '🔵'
    };
  }
  
  if (!actualTime) {
    return { 
      status: 'not-tracked',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      indicator: '⚪'
    };
  }

  const diff = actualTime - estimatedTime;
  const percentage = Math.abs(diff / estimatedTime * 100);
  
  if (diff <= 0) {
    // On time or under estimate
    return {
      status: 'on-time',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      indicator: '🟢'
    };
  } else if (percentage <= 25) {
    // Slightly over estimate (1-25% over)
    return {
      status: 'slightly-over',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
      indicator: '🟡'
    };
  } else {
    // Significantly over estimate (25%+ over)
    return {
      status: 'significantly-over',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      indicator: '🔴'
    };
  }
};

const TaskItem = ({ 
  task, 
  onToggle, 
  onQueue, 
  onUpdateTime, 
  onUpdateNotes,
  onUpdateName,
  isQueue = false, 
  showProject = false,
  autoTimeTracking = false,
  onStartTask
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempTime, setTempTime] = useState(task.estimatedTime || '');
  const [tempNotes, setTempNotes] = useState(task.notes || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(task.text || '');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect for running tasks
  useEffect(() => {
    let interval;
    if (task.isTimerRunning && task.startTime) {
      interval = setInterval(() => {
        const startTime = new Date(task.startTime);
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000 / 60);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [task.isTimerRunning, task.startTime]);

  const handleTimeUpdate = () => {
    const time = parseInt(tempTime) || 0;
    onUpdateTime(task.id, time);
    setIsEditingTime(false);
  };

  const handleNotesUpdate = () => {
    onUpdateNotes(task.id, tempNotes);
    setIsEditingNotes(false);
  };

  const handleNameUpdate = () => {
    if (tempName.trim()) {
      onUpdateName(task.id, tempName.trim());
      setIsEditingName(false);
    }
  };

  // Get time comparison for completed tasks
  const timeComparison = getTimeComparison(task.actualTime, task.estimatedTime);

  return (
    <div className={`flex flex-col w-full space-y-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
      task.done ? `${timeComparison.bgColor} ${timeComparison.borderColor}` : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-md'
    }`}>
      
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-grow text-lg border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameUpdate();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                autoFocus
              />
              <button
                onClick={handleNameUpdate}
                className="text-sm text-green-600 hover:text-green-800 bg-green-50 px-3 py-2 rounded-xl transition-colors"
              >
                ✓
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="text-sm text-gray-500 hover:text-gray-700 bg-gray-50 px-3 py-2 rounded-xl transition-colors"
              >
                ✗
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {task.done && (
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs">{timeComparison.indicator}</span>
                </div>
              )}
              <span 
                className={`text-lg cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors ${
                  task.done ? `line-through ${timeComparison.color} font-medium` : "text-gray-800"
                }`}
                onClick={() => setIsEditingName(true)}
                title="Click to edit task name"
              >
                {task.text}
              </span>
            </div>
          )}
          
          {showProject && (
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <span className="bg-gray-100 px-2 py-1 rounded-full">📁 {task.projectName}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Time Status Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          
          {/* Timer Status & Time Display */}
          {task.isTimerRunning ? (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">
                {elapsedTime}m running
              </span>
              {task.estimatedTime && (
                <span className="text-xs text-green-600">
                  / {task.estimatedTime}m est
                </span>
              )}
            </div>
          ) : task.done && (task.actualTime || task.estimatedTime) ? (
            <div className={`flex items-center space-x-2 ${timeComparison.bgColor} border ${timeComparison.borderColor} rounded-xl px-3 py-2`}>
              <span className="text-xs">{timeComparison.indicator}</span>
              <span className={`text-sm font-medium ${timeComparison.color}`}>
                {formatTime(task.actualTime || 0)}
                {task.estimatedTime && (
                  <span className="text-gray-500 ml-1">
                    / {formatTime(task.estimatedTime)}
                  </span>
                )}
              </span>
              {task.actualTime && task.estimatedTime && (
                <span className={`text-xs ${timeComparison.color}`}>
                  ({task.actualTime > task.estimatedTime ? '+' : ''}{task.actualTime - task.estimatedTime}m)
                </span>
              )}
            </div>
          ) : (
            /* Estimate Time Button */
            <div className="flex items-center space-x-2">
              {isEditingTime ? (
                <div className="flex items-center space-x-2 bg-white border border-purple-300 rounded-xl px-3 py-2">
                  <input
                    type="number"
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)}
                    placeholder="mins"
                    className="w-16 text-sm border-0 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleTimeUpdate()}
                    autoFocus
                  />
                  <button
                    onClick={handleTimeUpdate}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setIsEditingTime(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    ✗
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingTime(true)}
                  className="flex items-center text-sm text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-purple-50 px-3 py-2 rounded-xl transition-colors"
                >
                  ⏱️ {task.estimatedTime ? formatTime(task.estimatedTime) : 'Add time'}
                </button>
              )}
            </div>
          )}

          {/* Notes Button */}
          <button
            onClick={() => setIsEditingNotes(true)}
            className="flex items-center text-sm text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-purple-50 px-3 py-2 rounded-xl transition-colors"
          >
            💭 {task.notes ? 'Edit notes' : 'Add notes'}
          </button>

          {/* Start Task Button / In Progress Indicator */}
          {autoTimeTracking && isQueue && !task.done && (
            <div>
              {!task.isTimerRunning ? (
                <button
                  onClick={() => onStartTask && onStartTask(task.id)}
                  className="flex items-center text-sm text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  ▶️ Start Task
                </button>
              ) : null /* Timer display is handled above */}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQueue(task.id)}
            className={`px-4 py-2 rounded-xl border transition-all ${
              isQueue 
                ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100" 
                : "border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100"
            }`}
          >
            {isQueue ? "✖ Remove" : "➕ Queue"}
          </button>
          <button
            onClick={() => onToggle(task.id)}
            className="px-4 py-2 rounded-xl border border-green-300 text-green-600 bg-green-50 hover:bg-green-100 transition-all"
            disabled={task.isTimerRunning}
          >
            {task.done ? "Undo" : "Done"}
          </button>
        </div>
      </div>

      {/* Task Notes Display */}
      {task.notes && !isEditingNotes && (
        <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-200">
          💭 {task.notes}
        </div>
      )}
      
      {/* Edit Notes */}
      {isEditingNotes && (
        <div className="bg-white border border-purple-300 rounded-xl p-3">
          <textarea
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            placeholder="Add notes..."
            className="w-full text-sm border-0 focus:outline-none resize-none"
            rows="2"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleNotesUpdate}
              className="text-sm text-green-600 hover:text-green-800 bg-green-50 px-3 py-1 rounded-xl transition-colors"
            >
              ✓ Save
            </button>
            <button
              onClick={() => setIsEditingNotes(false)}
              className="text-sm text-gray-500 hover:text-gray-700 bg-gray-50 px-3 py-1 rounded-xl transition-colors"
            >
              ✗ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {task.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;