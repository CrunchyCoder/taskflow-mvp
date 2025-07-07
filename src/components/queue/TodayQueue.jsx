import React, { useState, useEffect } from 'react';
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
  // Existing functionality
  const [autoTimeTracking, setAutoTimeTracking] = useState(false);
  
  // New functionality for tabs and animations
  const [activeTab, setActiveTab] = useState('active');
  const [completedToday, setCompletedToday] = useState([]);
  const [animatingTask, setAnimatingTask] = useState(null);

  // Load time tracking preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('autoTimeTracking');
    if (savedPreference !== null) {
      setAutoTimeTracking(JSON.parse(savedPreference));
    }
  }, []);

  // Load completed tasks from localStorage on component mount
  useEffect(() => {
    const loadCompletedTasks = () => {
      const today = new Date().toDateString();
      const allCompletedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      const todaysCompleted = allCompletedTasks.filter(task => 
        new Date(task.completedAt).toDateString() === today
      );
      setCompletedToday(todaysCompleted);
    };

    loadCompletedTasks();
    
    // Listen for task completions - reload when localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'completedTasks') {
        loadCompletedTasks();
      }
    };
    
    // Also listen for custom events when we update completed tasks
    const handleCompletedTasksUpdate = () => {
      loadCompletedTasks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('completedTasksUpdated', handleCompletedTasksUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('completedTasksUpdated', handleCompletedTasksUpdate);
    };
  }, []);

  // Get completed task IDs for filtering - define early so it can be used everywhere
  const completedTaskIds = completedToday.map(task => task.id);
  
  // Filter active tasks - exclude any that are in completed list OR have completed: true
  const activeTasks = todoQueue.filter(task => 
    !task.completed && !completedTaskIds.includes(task.id)
  );

  // Save time tracking preference to localStorage
  const handleToggleTimeTracking = () => {
    const newValue = !autoTimeTracking;
    setAutoTimeTracking(newValue);
    localStorage.setItem('autoTimeTracking', JSON.stringify(newValue));
  };

  // Enhanced toggle handler with animation
  const handleToggleWithAnimation = async (taskId, actualTime) => {
    const task = todoQueue.find(t => t.id === taskId);
    if (!task || completedTaskIds.includes(taskId)) return; // Prevent duplicate completions

    // Start animation
    setAnimatingTask(taskId);
    
    // Play poof sound
    playPoofSound();
    
    // Create completed task object immediately
    const completedTask = {
      ...task,
      completed: true,
      actualTime: actualTime || 0,
      completedAt: new Date().toISOString()
    };

    // Update completed tasks state immediately (before animation)
    setCompletedToday(prev => {
      // Check if task is already in completed list
      if (prev.some(t => t.id === taskId)) {
        return prev; // Don't add duplicate
      }
      return [...prev, completedTask];
    });

    // Save to localStorage
    const allCompleted = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    // Check for duplicates in localStorage too
    if (!allCompleted.some(t => t.id === taskId)) {
      allCompleted.push(completedTask);
      localStorage.setItem('completedTasks', JSON.stringify(allCompleted));
    }
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Clear animation
    setAnimatingTask(null);
    
    // Call original toggle to remove from active queue
    onToggle(taskId, actualTime);
  };

  // Handle undoing a completed task
  const handleUndoTask = (taskId) => {
    console.log('Undoing task:', taskId);
    
    // Remove from completed list immediately
    setCompletedToday(prev => {
      const filtered = prev.filter(t => t.id !== taskId);
      console.log('Updated completed list:', filtered);
      return filtered;
    });

    // Update localStorage - remove from completed tasks
    const allCompleted = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    const filteredCompleted = allCompleted.filter(t => t.id !== taskId);
    localStorage.setItem('completedTasks', JSON.stringify(filteredCompleted));

    console.log('Task should now appear in active queue again');
  };

  // Play poof sound effect
  const playPoofSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Poof sound: quick frequency sweep down
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Format time with color coding
  const formatTimeWithColor = (actualTime, estimatedTime) => {
    if (!actualTime && !estimatedTime) return { text: 'No time tracked', color: 'text-gray-500' };
    if (!estimatedTime) return { text: `${actualTime}m`, color: 'text-blue-600' };
    if (!actualTime) return { text: `Est: ${estimatedTime}m`, color: 'text-gray-500' };

    const diff = actualTime - estimatedTime;
    const percentage = Math.abs(diff / estimatedTime * 100);
    
    let color = 'text-green-600'; // On time or under
    if (diff > 0 && percentage <= 25) color = 'text-orange-500'; // Slightly over
    if (diff > 0 && percentage > 25) color = 'text-red-500'; // Significantly over
    
    return {
      text: `${actualTime}m (vs ${estimatedTime}m est)`,
      color
    };
  };



  return (
    <DropZone onDrop={onDrop} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Main Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          📋 Today's Queue
        </h2>
        <span className="text-sm text-gray-500">
          {activeTab === 'active' ? `${activeTasks.length} tasks` : `${completedToday.length} completed`}
        </span>
      </div>

      {/* Tab Buttons */}
      <div className="flex bg-gray-100 rounded-full p-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === 'active'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Active Queue
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === 'completed'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Completed Today
          {completedToday.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
              {completedToday.length}
            </span>
          )}
        </button>
      </div>

      {/* Time Tracking Toggle - Only show on Active tab */}
      {activeTab === 'active' && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⏱️</div>
            <div>
              <div className="text-sm font-medium text-gray-800">Auto Time Tracking</div>
              <div className="text-xs text-gray-600">Start tasks to automatically track time</div>
            </div>
          </div>
          
          <button
            onClick={handleToggleTimeTracking}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              autoTimeTracking 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' 
                : 'bg-gray-300'
            }`}
          >
            <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform duration-300 shadow-md ${
              autoTimeTracking ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'active' ? (
        // Active Queue Tab
        <div>
          {/* Time Display - Only show when there are tasks */}
          {activeTasks.length > 0 && (
            <TimeDisplay tasks={activeTasks} title="⏰ Today's Schedule" />
          )}

          {activeTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-lg">No tasks queued for today</p>
              <p className="text-sm">Drag tasks here or use the Queue button</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map(task => {
                // Skip if this task is being animated out or is in completed list
                if (animatingTask === task.id || completedTaskIds.includes(task.id)) {
                  return (
                    <div
                      key={task.id}
                      className="transform translate-x-full opacity-0 scale-95 transition-all duration-600"
                    />
                  );
                }
                
                return (
                  <div
                    key={task.id}
                    className="transform translate-x-0 opacity-100 scale-100 transition-all duration-600"
                  >
                    <TaskList
                      items={[task]}
                      onToggle={handleToggleWithAnimation}
                      onQueue={onRemoveFromQueue}
                      onUpdateTime={onUpdateTime}
                      onUpdateNotes={onUpdateNotes}
                      onUpdateName={onUpdateName}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      isQueue={true}
                      showProject={true}
                      autoTimeTracking={autoTimeTracking}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // Completed Today Tab
        <div className="space-y-3">
          {completedToday.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-lg">No tasks completed today yet</p>
              <p className="text-sm">Complete some tasks to see them here!</p>
            </div>
          ) : (
            completedToday.map(task => {
              const timeDisplay = formatTimeWithColor(task.actualTime, task.estimatedTime);
              return (
                <div
                  key={task.id}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-800 line-through decoration-green-500">
                          {task.text}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`font-medium ${timeDisplay.color}`}>
                            {timeDisplay.text}
                          </span>
                          <span className="text-gray-500">
                            Completed {new Date(task.completedAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        {/* Undo Button */}
                        <button
                          onClick={() => handleUndoTask(task.id)}
                          className="px-3 py-1 text-xs text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors duration-200"
                        >
                          Undo
                        </button>
                      </div>
                    </div>
                    
                    {task.priority && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </DropZone>
  );
};

export default TodayQueue;