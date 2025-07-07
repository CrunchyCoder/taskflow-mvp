import React, { useState } from 'react';
import DraggableTask from '../common/DraggableTask';
import TaskItem from './TaskItem';
import TaskCompletionModal from '../accountability/TaskCompletionModal';

const TaskList = ({
  items,
  onToggle,
  onQueue,
  onUpdateTime,
  onUpdateNotes,
  onUpdateName,
  onDragStart,
  onDragEnd,
  isQueue = false,
  showProject = false,
  autoTimeTracking = false
}) => {
  // State for the completion modal
  const [completionModal, setCompletionModal] = useState({
    isOpen: false,
    task: null,
    actualTime: 0
  });

  // Handle starting a task timer
  const handleStartTask = (taskId) => {
    console.log('🚀 Starting task:', taskId);
    
    const startTime = new Date().toISOString();
    
    // Find the task
    const taskToStart = items.find(item => item.id === taskId);
    console.log('📋 Found task:', taskToStart);
    
    if (!taskToStart) {
      console.error('❌ Task not found!');
      return;
    }

    // FIRST: Stop all other running timers
    items.forEach(item => {
      if (item.isTimerRunning && item.id !== taskId) {
        console.log('⏹️ Stopping timer for:', item.text);
        onUpdateTime(item.id, { isTimerRunning: false, startTime: null });
      }
    });

    // THEN: Start the new timer
    console.log('▶️ Starting new timer');
    
    // Save to localStorage
    const activeTimers = JSON.parse(localStorage.getItem('activeTimers') || '{}');
    
    // Clear all other timers from localStorage
    Object.keys(activeTimers).forEach(id => {
      if (id !== taskId) {
        delete activeTimers[id];
      }
    });
    
    activeTimers[taskId] = {
      startTime,
      taskName: taskToStart.text
    };
    localStorage.setItem('activeTimers', JSON.stringify(activeTimers));
    console.log('💾 Saved to localStorage:', activeTimers);
    
    // Start this timer
    if (onUpdateTime) {
      console.log('🔄 Calling onUpdateTime with:', { startTime, isTimerRunning: true });
      onUpdateTime(taskId, { startTime, isTimerRunning: true });
    }
  };

  // Handle task completion (calculate actual time)
  const handleTaskComplete = (taskId) => {
    const task = items.find(item => item.id === taskId);
    console.log('🎯 Completing task:', task);
    
    let actualTime = 0;
    
    if (task && task.isTimerRunning && task.startTime) {
      // Calculate actual time spent
      const startTime = new Date(task.startTime);
      const endTime = new Date();
      
      console.log('⏰ Start time:', startTime);
      console.log('⏰ End time:', endTime);
      
      const timeDiffMs = endTime - startTime;
      actualTime = Math.round(timeDiffMs / (1000 * 60)); // minutes
      
      console.log('⏰ Time diff (ms):', timeDiffMs);
      console.log('⏰ Actual time (minutes):', actualTime);
      
      // Clear from localStorage
      const activeTimers = JSON.parse(localStorage.getItem('activeTimers') || '{}');
      delete activeTimers[taskId];
      localStorage.setItem('activeTimers', JSON.stringify(activeTimers));
    }
    
    // Check if we should show the completion modal
    const shouldShowModal = task && (
      task.estimatedTime > 0 || // Has estimated time
      actualTime > 0 || // Was actively timed
      task.isTimerRunning // Was running when completed
    );
    
    if (shouldShowModal) {
      // Show the completion modal first
      setCompletionModal({
        isOpen: true,
        task: task,
        actualTime: actualTime
      });
    } else {
      // Complete the task immediately if no modal needed
      console.log('✅ Completing task without modal');
      onToggle(taskId, actualTime);
    }
  };

  // Handle completion modal submission
  const handleCompletionModalSubmit = (feedbackData) => {
    console.log('📝 Completion modal submitted:', feedbackData);
    
    // Save feedback to localStorage
    const existingInsights = JSON.parse(localStorage.getItem('taskInsights') || '[]');
    const insight = {
      ...feedbackData,
      timestamp: new Date().toISOString()
    };
    existingInsights.push(insight);
    localStorage.setItem('taskInsights', JSON.stringify(existingInsights));
    console.log('💾 Saved insight:', insight);
    
    // Complete the task
    console.log('✅ Calling onToggle with actualTime:', completionModal.actualTime);
    onToggle(completionModal.task.id, completionModal.actualTime);
    
    // Close the modal
    setCompletionModal({
      isOpen: false,
      task: null,
      actualTime: 0
    });
  };

  // Handle modal close
  const handleCompletionModalClose = () => {
    // Complete the task without saving feedback (skip)
    console.log('⏭️ Skipping feedback, completing task');
    onToggle(completionModal.task.id, completionModal.actualTime);
    
    setCompletionModal({
      isOpen: false,
      task: null,
      actualTime: 0
    });
  };

  return (
    <>
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
              onToggle={handleTaskComplete} // Use our enhanced completion handler
              onQueue={onQueue}
              onUpdateTime={onUpdateTime}
              onUpdateNotes={onUpdateNotes}
              onUpdateName={onUpdateName}
              isQueue={isQueue}
              showProject={showProject}
              autoTimeTracking={autoTimeTracking}
              onStartTask={handleStartTask}
            />
          </DraggableTask>
        ))}
      </ul>

      {/* Task Completion Modal */}
      <TaskCompletionModal
        isOpen={completionModal.isOpen}
        onClose={handleCompletionModalClose}
        task={completionModal.task}
        actualTime={completionModal.actualTime}
        onSaveFeedback={handleCompletionModalSubmit}
      />
    </>
  );
};

export default TaskList;