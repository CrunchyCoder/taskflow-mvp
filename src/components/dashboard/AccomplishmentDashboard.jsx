import React, { useState } from 'react';
import { formatTime, calculateTotalTime } from '../../utils/helpers';

const AccomplishmentDashboard = ({ tasks, projects, getProjectName }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

  // Filter completed tasks based on selected period
  const getCompletedTasksForPeriod = () => {
    const now = new Date();
    const completedTasks = tasks.filter(task => task.done && task.completedAt);

    switch (selectedPeriod) {
      case 'Day':
        const today = new Date().toDateString();
        return completedTasks.filter(task => 
          new Date(task.completedAt).toDateString() === today
        );
      case 'Week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return completedTasks.filter(task => 
          new Date(task.completedAt) >= weekAgo
        );
      case 'Month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return completedTasks.filter(task => 
          new Date(task.completedAt) >= monthAgo
        );
      case 'Quarter':
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return completedTasks.filter(task => 
          new Date(task.completedAt) >= quarterAgo
        );
      case 'Year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return completedTasks.filter(task => 
          new Date(task.completedAt) >= yearAgo
        );
      default:
        return completedTasks;
    }
  };

  // Group tasks by project
  const getProjectBreakdown = () => {
    const completedTasks = getCompletedTasksForPeriod();
    const projectGroups = {};

    completedTasks.forEach(task => {
      const projectName = getProjectName(task.projectId);
      if (!projectGroups[projectName]) {
        projectGroups[projectName] = [];
      }
      projectGroups[projectName].push(task);
    });

    return Object.entries(projectGroups).map(([projectName, tasks]) => ({
      projectName,
      tasks,
      totalTime: calculateTotalTime(tasks),
      taskCount: tasks.length
    }));
  };

  const completedTasks = getCompletedTasksForPeriod();
  const totalTime = calculateTotalTime(completedTasks);
  const projectBreakdown = getProjectBreakdown();

  const periods = ['Day', 'Week', 'Month', 'Quarter', 'Year'];

  return (
    <div className="space-y-6">
      {/* Header with Time Period Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          📊 Completed Tasks
        </h1>
        
        {/* Period Selector */}
        <div className="flex bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
          {periods.map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <div className="text-3xl font-bold text-purple-600">{completedTasks.length}</div>
          <div className="text-gray-600 font-medium">Total Tasks</div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <div className="text-3xl font-bold text-blue-600">{formatTime(totalTime)}</div>
          <div className="text-gray-600 font-medium">Total Time</div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <div className="text-3xl font-bold text-green-600">
            {totalTime > 0 ? formatTime(Math.round(totalTime / Math.max(completedTasks.length, 1))) : '0m'}
          </div>
          <div className="text-gray-600 font-medium">Est vs Actual</div>
        </div>
      </div>

      {/* Project Breakdown */}
      {projectBreakdown.length > 0 ? (
        <div className="space-y-4">
          {projectBreakdown.map(({ projectName, tasks, totalTime, taskCount }) => (
            <div key={projectName} className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{projectName}</h3>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{formatTime(totalTime)}</div>
                  <div className="text-sm text-gray-500">{taskCount} tasks</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center">
                      <span className="mr-2">✅</span>
                      {task.text}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTime(task.estimatedTime || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-lg">No completed tasks for this period</p>
          <p className="text-sm">Complete some tasks to see your accomplishments!</p>
        </div>
      )}
    </div>
  );
};

export default AccomplishmentDashboard;