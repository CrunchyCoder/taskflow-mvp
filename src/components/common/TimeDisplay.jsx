import React from 'react';
import { formatTime, calculateTotalTime } from '../../utils/helpers';

// Enhanced time comparison utility
const getTimeComparison = (actualTime, estimatedTime) => {
  if (!actualTime && !estimatedTime) {
    return { 
      status: 'no-data',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-100',
      indicator: '⚪'
    };
  }
  
  if (!estimatedTime) {
    return { 
      status: 'no-estimate',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      indicator: '🔵'
    };
  }
  
  if (!actualTime) {
    return { 
      status: 'not-tracked',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-100',
      indicator: '⚪'
    };
  }

  const diff = actualTime - estimatedTime;
  const percentage = Math.abs(diff / estimatedTime * 100);
  
  if (diff <= 0) {
    // On time or under estimate
    return {
      status: 'on-time',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100',
      indicator: '🟢'
    };
  } else if (percentage <= 25) {
    // Slightly over estimate (1-25% over)
    return {
      status: 'slightly-over',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      indicator: '🟡'
    };
  } else {
    // Significantly over estimate (25%+ over)
    return {
      status: 'significantly-over',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-100',
      indicator: '🔴'
    };
  }
};

const TimeDisplay = ({ tasks, title }) => {
  const totalEstimated = calculateTotalTime(tasks);
  const completedTasks = tasks.filter(t => t.completed || t.done);
  const completedEstimated = calculateTotalTime(completedTasks);
  const remainingEstimated = totalEstimated - completedEstimated;
  
  // Calculate actual time spent on completed tasks
  const totalActualTime = completedTasks.reduce((sum, task) => {
    return sum + (task.actualTime || 0);
  }, 0);
  
  // Get overall time comparison for completed tasks
  const overallComparison = getTimeComparison(totalActualTime, completedEstimated);
  
  // Calculate accuracy percentage
  const getAccuracyText = () => {
    if (!completedEstimated || !totalActualTime) return null;
    
    const diff = totalActualTime - completedEstimated;
    const percentage = Math.round(Math.abs(diff / completedEstimated * 100));
    
    if (diff === 0) return "Perfect estimates!";
    if (diff > 0) return `${percentage}% over estimates`;
    return `${percentage}% under estimates`;
  };

  const accuracyText = getAccuracyText();

  return (
    <div className="bg-gradient-to-r from-indigo-50/90 to-purple-50/90 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-lg">
      <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h3>
      
      {/* Main Time Grid */}
      <div className="grid grid-cols-3 gap-6 text-sm mb-4">
        <div className="text-center bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="font-bold text-2xl bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {formatTime(totalEstimated)}
          </div>
          <div className="text-gray-600 font-medium">Total Estimated</div>
        </div>
        
        <div className="text-center bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className={`font-bold text-2xl bg-gradient-to-r ${overallComparison.color} bg-clip-text text-transparent`}>
            {formatTime(totalActualTime)}
          </div>
          <div className="text-gray-600 font-medium">Actual Done</div>
          {completedEstimated > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              vs {formatTime(completedEstimated)} est
            </div>
          )}
        </div>
        
        <div className="text-center bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {formatTime(remainingEstimated)}
          </div>
          <div className="text-gray-600 font-medium">Remaining</div>
        </div>
      </div>

      {/* Accuracy Indicator */}
      {accuracyText && completedTasks.length > 0 && (
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${overallComparison.bgColor}`}>
          <span className="mr-2">{overallComparison.indicator}</span>
          <span className={`bg-gradient-to-r ${overallComparison.color} bg-clip-text text-transparent font-semibold`}>
            {accuracyText}
          </span>
          <span className="ml-2 text-gray-600">
            ({completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} completed)
          </span>
        </div>
      )}

      {/* Tasks Breakdown */}
      {completedTasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/40">
          <div className="text-xs text-gray-600 mb-2 font-medium">Recent Completions:</div>
          <div className="space-y-1">
            {completedTasks.slice(-3).map(task => {
              const taskComparison = getTimeComparison(task.actualTime, task.estimatedTime);
              return (
                <div key={task.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 truncate flex-1 mr-2">{task.text}</span>
                  <div className="flex items-center space-x-1">
                    <span>{taskComparison.indicator}</span>
                    <span className={`bg-gradient-to-r ${taskComparison.color} bg-clip-text text-transparent font-medium`}>
                      {formatTime(task.actualTime || 0)}
                    </span>
                    {task.estimatedTime && (
                      <span className="text-gray-500">
                        /{formatTime(task.estimatedTime)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;