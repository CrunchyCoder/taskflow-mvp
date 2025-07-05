import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatTime, calculateTotalTime } from '../../utils/helpers';

const PROJECT_CATEGORIES = [
  { id: 'personal', name: 'Personal', icon: '👤', color: 'green' },
  { id: 'work', name: 'Work', icon: '🏢', color: 'blue' },
  { id: 'chores', name: 'Chores', icon: '🏠', color: 'yellow' },
  { id: 'urgent', name: 'Urgent', icon: '🚨', color: 'red' }
];

const AccomplishmentDashboard = ({ tasks, projects, getProjectName }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [categoryDropdowns, setCategoryDropdowns] = useState(new Set());
  const [dropdownPositions, setDropdownPositions] = useState({});

  // Toggle project expansion
  const toggleProject = (projectName) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectName)) {
      newExpanded.delete(projectName);
    } else {
      newExpanded.add(projectName);
    }
    setExpandedProjects(newExpanded);
  };

  // Toggle category dropdown (only one at a time)
  const toggleCategoryDropdown = (projectName) => {
    setCategoryDropdowns(prev => {
      const newSet = new Set();
      if (!prev.has(projectName)) {
        newSet.add(projectName);
      }
      return newSet;
    });
  };

  // Get category info for a project
  const getProjectCategory = (projectName) => {
    return PROJECT_CATEGORIES.find(cat => cat.id === 'personal');
  };

  // Get color classes for category
  const getCategoryColors = (categoryId) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200'
    };
    return colorMap[categoryId] || colorMap.green;
  };

  // Get category colors for charts
  const getCategoryChartColors = (categoryId) => {
    const colorMap = {
      blue: '#3b82f6',
      green: '#10b981', 
      yellow: '#f59e0b',
      red: '#ef4444',
      personal: '#10b981',
      work: '#3b82f6',
      chores: '#f59e0b',
      urgent: '#ef4444'
    };
    return colorMap[categoryId] || '#6b7280';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setCategoryDropdowns(new Set());
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  // Get productivity trends data for chart
  const getProductivityTrendsData = () => {
    const days = [];
    const today = new Date();
    
    // Get last 14 days of data
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toDateString();
      
      // Count tasks completed on this day
      const completedOnDay = tasks.filter(task => 
        task.done && 
        task.completedAt && 
        new Date(task.completedAt).toDateString() === dateString
      ).length;
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: dateString,
        completed: completedOnDay,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return days;
  };

  // Get category breakdown data for pie chart
  const getCategoryBreakdownData = () => {
    const categoryData = {};
    
    // Initialize categories with 0 time
    PROJECT_CATEGORIES.forEach(category => {
      categoryData[category.id] = {
        name: category.name,
        icon: category.icon,
        color: category.color,
        time: 0,
        taskCount: 0
      };
    });
    
    // Calculate time and tasks for each category
    const completedTasks = getCompletedTasksForPeriod();
    completedTasks.forEach(task => {
      // For now, all projects are 'personal' category
      // Later we'll use actual project categories
      const categoryId = 'personal'; 
      if (categoryData[categoryId]) {
        categoryData[categoryId].time += task.estimatedTime || 0;
        categoryData[categoryId].taskCount += 1;
      }
    });
    
    // Convert to array and filter out categories with no data
    return Object.values(categoryData)
      .filter(category => category.time > 0 || category.taskCount > 0)
      .sort((a, b) => b.time - a.time);
  };

  // Group tasks by project with completion metrics
  const getProjectBreakdown = () => {
    const completedTasks = getCompletedTasksForPeriod();
    const projectGroups = {};

    projects.forEach(project => {
      const allProjectTasks = tasks.filter(task => task.projectId === project.id);
      const completedProjectTasks = completedTasks.filter(task => task.projectId === project.id);
      
      if (allProjectTasks.length > 0) {
        projectGroups[project.name] = {
          projectId: project.id,
          allTasks: allProjectTasks,
          completedTasks: completedProjectTasks,
          totalTime: calculateTotalTime(completedProjectTasks),
          completionRate: Math.round((completedProjectTasks.length / allProjectTasks.length) * 100)
        };
      }
    });

    return Object.entries(projectGroups)
      .map(([projectName, data]) => ({
        projectName,
        ...data
      }))
      .sort((a, b) => b.completedTasks.length - a.completedTasks.length);
  };

  // Calculate completed projects (projects with all tasks done)
  const getCompletedProjectsData = () => {
    const projectStats = projects.map(project => {
      const allProjectTasks = tasks.filter(task => task.projectId === project.id);
      const completedProjectTasks = allProjectTasks.filter(task => task.done);
      const isCompleted = allProjectTasks.length > 0 && completedProjectTasks.length === allProjectTasks.length;
      
      return {
        projectName: project.name,
        isCompleted,
        totalTasks: allProjectTasks.length,
        completedTasks: completedProjectTasks.length
      };
    }).filter(p => p.totalTasks > 0);

    const completedProjects = projectStats.filter(p => p.isCompleted).length;
    const totalProjects = projectStats.length;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    return { completedProjects, totalProjects, completionRate };
  };

  // Get tasks completed this week
  const getThisWeekData = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const thisWeekTasks = tasks.filter(task => 
      task.done && 
      task.completedAt && 
      new Date(task.completedAt) >= weekAgo
    );
    
    const lastWeekTasks = tasks.filter(task => 
      task.done && 
      task.completedAt && 
      new Date(task.completedAt) >= twoWeeksAgo && 
      new Date(task.completedAt) < weekAgo
    );

    const thisWeekCount = thisWeekTasks.length;
    const lastWeekCount = lastWeekTasks.length;
    
    let trendPercentage = 0;
    let trendDirection = 'same';
    
    if (lastWeekCount > 0) {
      trendPercentage = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
      trendDirection = trendPercentage > 0 ? 'up' : trendPercentage < 0 ? 'down' : 'same';
    } else if (thisWeekCount > 0) {
      trendDirection = 'up';
      trendPercentage = 100;
    }

    return {
      thisWeekCount,
      lastWeekCount,
      trendPercentage: Math.abs(trendPercentage),
      trendDirection
    };
  };

  // Get trend indicator component
  const TrendIndicator = ({ trendDirection, trendPercentage }) => {
    if (trendDirection === 'same') {
      return <span className="text-gray-500 text-sm">→ Same as last week</span>;
    }
    
    const isPositive = trendDirection === 'up';
    return (
      <span className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-orange-600'}`}>
        <span className="mr-1">{isPositive ? '🔼' : '🔽'}</span>
        {isPositive ? '+' : '-'}{trendPercentage}% vs last week
      </span>
    );
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

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Completed */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <div className="text-3xl font-bold text-purple-600">{completedTasks.length}</div>
          <div className="text-gray-600 font-medium">Total Tasks</div>
          <div className="text-sm text-gray-500 mt-1">This {selectedPeriod.toLowerCase()}</div>
        </div>

        {/* Completed Projects */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-emerald-600">{getCompletedProjectsData().completedProjects}</div>
            <div className="text-lg text-gray-500">/ {getCompletedProjectsData().totalProjects}</div>
          </div>
          <div className="text-gray-600 font-medium">Completed Projects</div>
          <div className="text-sm text-emerald-600 mt-1">{getCompletedProjectsData().completionRate}% completion rate</div>
        </div>

        {/* This Week Tasks (with trend) */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <div className="text-3xl font-bold text-blue-600">{getThisWeekData().thisWeekCount}</div>
          <div className="text-gray-600 font-medium">This Week</div>
          <div className="mt-1">
            <TrendIndicator 
              trendDirection={getThisWeekData().trendDirection}
              trendPercentage={getThisWeekData().trendPercentage}
            />
          </div>
        </div>

        {/* Total Time */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <div className="text-3xl font-bold text-indigo-600">{formatTime(totalTime)}</div>
          <div className="text-gray-600 font-medium">Total Time</div>
          <div className="text-sm text-gray-500 mt-1">
            {totalTime > 0 ? `${formatTime(Math.round(totalTime / Math.max(completedTasks.length, 1)))} avg/task` : 'No time tracked'}
          </div>
        </div>
      </div>

      {/* Advanced Analytics Charts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          📊 Analytics & Insights
        </h2>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productivity Trends Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Productivity Trends</h3>
            <div className="h-64 relative">
              {(() => {
                const trendsData = getProductivityTrendsData();
                const maxTasks = Math.max(...trendsData.map(d => d.completed), 1);
                
                return (
                  <div className="w-full h-full flex items-end justify-between px-2">
                    {trendsData.map((day, index) => {
                      const height = maxTasks > 0 ? (day.completed / maxTasks) * 100 : 0;
                      return (
                        <div key={index} className="flex flex-col items-center flex-1 group">
                          {/* Bar */}
                          <div className="relative w-full max-w-8 mx-1">
                            <div 
                              className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-300 group-hover:from-purple-600 group-hover:to-purple-500 relative"
                              style={{ 
                                height: `${Math.max(height, 5)}%`,
                                minHeight: day.completed > 0 ? '8px' : '2px'
                              }}
                            >
                              {/* Tooltip on hover */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {day.completed} tasks
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Date label */}
                          <div className="text-xs text-gray-600 mt-2 text-center">
                            <div>{day.date.split(' ')[1]}</div>
                            <div className="text-gray-400">{day.dayName}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Last 14 days of task completion
            </div>
          </div>

          {/* Category Breakdown Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🥧 Time by Category</h3>
            <div className="h-64">
              {(() => {
                const categoryData = getCategoryBreakdownData();
                const totalTime = categoryData.reduce((sum, cat) => sum + cat.time, 0);
                
                if (totalTime === 0) {
                  return (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No time tracked yet
                    </div>
                  );
                }
                
                return (
                  <div className="flex flex-col h-full">
                    {/* Custom Donut Chart */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative w-40 h-40">
                        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                          {(() => {
                            let currentAngle = 0;
                            const radius = 45;
                            const centerX = 60;
                            const centerY = 60;
                            
                            return categoryData.map((category, index) => {
                              const percentage = (category.time / totalTime) * 100;
                              const angle = (percentage / 100) * 360;
                              const startAngle = currentAngle;
                              const endAngle = currentAngle + angle;
                              
                              const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
                              const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
                              const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
                              const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
                              
                              const largeArcFlag = angle > 180 ? 1 : 0;
                              
                              const pathData = [
                                `M ${centerX} ${centerY}`,
                                `L ${startX} ${startY}`,
                                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                'Z'
                              ].join(' ');
                              
                              currentAngle += angle;
                              
                              return (
                                <path
                                  key={category.name}
                                  d={pathData}
                                  fill={getCategoryChartColors(category.color)}
                                  opacity="0.8"
                                  className="hover:opacity-100 transition-opacity"
                                />
                              );
                            });
                          })()}
                          
                          {/* Center circle to make it a donut */}
                          <circle
                            cx="60"
                            cy="60"
                            r="25"
                            fill="white"
                            className="drop-shadow-sm"
                          />
                        </svg>
                        
                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <div className="text-lg font-bold text-gray-800">{formatTime(totalTime)}</div>
                          <div className="text-xs text-gray-500">Total Time</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {categoryData.map(category => (
                        <div key={category.name} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryChartColors(category.color) }}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {category.icon} {category.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({formatTime(category.time)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Task Heatmap - Full Width */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Task Completion Heatmap</h3>
          <div className="h-32 bg-gray-50 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500">Task Heatmap Coming Soon</span>
          </div>
        </div>

        {/* Achievements Row */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Achievements & Streaks</h3>
          <div className="h-24 bg-gray-50 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500">Achievements Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Project Breakdown with Collapsible Tasks */}
      {projectBreakdown.length > 0 ? (
        <div className="space-y-4">
          {projectBreakdown.map(({ projectName, completedTasks, allTasks, totalTime, completionRate }) => {
            const isExpanded = expandedProjects.has(projectName);
            
            return (
              <div key={projectName} className="relative bg-white/80 backdrop-blur-lg rounded-3xl border border-white/40 shadow-xl overflow-visible">
                {/* Project Header - Clickable */}
                <div className="relative">
                  <button
                    onClick={() => toggleProject(projectName)}
                    className="w-full p-6 text-left hover:bg-white/60 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                          <h3 className="text-xl font-bold text-gray-800">{projectName}</h3>
                          
                          {/* NEW: Completion Pills */}
                          <div className="flex items-center space-x-2">
                            {/* Category Badge with Dropdown */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rect = e.target.getBoundingClientRect();
                                  setDropdownPositions(prev => ({
                                    ...prev,
                                    [projectName]: {
                                      top: rect.bottom + 4,
                                      left: rect.left
                                    }
                                  }));
                                  toggleCategoryDropdown(projectName);
                                }}
                                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all hover:scale-105 ${
                                  getCategoryColors(getProjectCategory(projectName).color)
                                }`}
                              >
                                <span className="mr-1">{getProjectCategory(projectName).icon}</span>
                                {getProjectCategory(projectName).name}
                              </button>

                              {/* Dropdown with dynamic positioning */}
                              {categoryDropdowns.has(projectName) && dropdownPositions[projectName] && createPortal(
                                <div className="fixed bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 w-48"
                                     style={{
                                       position: 'fixed',
                                       top: dropdownPositions[projectName].top + 'px',
                                       left: dropdownPositions[projectName].left + 'px',
                                       zIndex: 9999
                                     }}>
                                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                                    Change Category
                                  </div>
                                  {PROJECT_CATEGORIES.map(category => (
                                    <button
                                      key={category.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategoryDropdown(projectName);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                                        getProjectCategory(projectName).id === category.id ? 'bg-blue-50 border-r-4 border-blue-400' : ''
                                      }`}
                                    >
                                      <span>{category.icon}</span>
                                      <span>{category.name}</span>
                                      {getProjectCategory(projectName).id === category.id && (
                                        <span className="ml-auto text-blue-500 text-xs">✓</span>
                                      )}
                                    </button>
                                  ))}
                                </div>,
                                document.body
                              )}
                            </div>

                            {/* Tasks Left Pill */}
                            {(allTasks.length - completedTasks.length) > 0 && (
                              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                {allTasks.length - completedTasks.length} left
                              </span>
                            )}

                            {/* Tasks Done Pill */}
                            {completedTasks.length > 0 && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                {completedTasks.length} done
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Completion Meter */}
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {completionRate}% ({completedTasks.length}/{allTasks.length})
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{formatTime(totalTime)}</div>
                        <div className="text-sm text-gray-500">{completedTasks.length} completed tasks</div>
                      </div>
                    </div>
                  </button>
                </div>
                
                {/* Collapsible Task List */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="space-y-2 mt-4">
                      {completedTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center py-3 px-4 bg-gray-50/80 rounded-xl ml-8">
                          <span className="flex items-center space-x-3">
                            <span className="text-green-500 text-lg">✅</span>
                            <span className="text-gray-700">{task.text}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.priority === 'high' ? 'bg-red-100 text-red-600' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {task.priority}
                            </span>
                          </span>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>{formatTime(task.estimatedTime || 0)}</span>
                            <span>•</span>
                            <span>{new Date(task.completedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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