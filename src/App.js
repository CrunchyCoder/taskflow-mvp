import React, { useState } from 'react';
import { useTaskFlow } from './hooks/useTaskFlow';
import Sidebar from './components/layout/Sidebar';
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import TimeDisplay from './components/common/TimeDisplay';
import DailyPlanningModal from './components/planning/DailyPlanningModal';  
import TodayQueue from './components/queue/TodayQueue';
import DailyReflectionModal from './components/reflection/DailyReflectionModal';
import AccomplishmentDashboard from './components/dashboard/AccomplishmentDashboard'; 

function App() {
  const {
    projects,
    tasks,
    todoQueue,
    selectedProjectId,
    setSelectedProjectId,
    addProject,
    getProject,
    getProjectName,
    addTask,
    toggleTaskDone,
    updateTaskTime,
    updateTaskNotes,
    updateTaskName,
    getProjectTasks,
    addToQueue,
    removeFromQueue,
    // Dashboard functions - ADD THESE
    currentView,
    switchToTasksView,
    switchToDashboardView,
    // Add these planning functions
    dailyTimeAvailable,
    planningModalOpen,
    lastPlanningDate,  // ADD THIS LINE
    updateDailyTimeAvailable,
    openPlanningModal,
    closePlanningModal,
    shouldShowPlanningPrompt,
    // Add these reflection functions
    reflectionModalOpen,
    dailyReflections,
    todayReflection,
    openReflectionModal,
    closeReflectionModal,
    saveReflection,
    shouldShowReflectionPrompt,
    getEstimationAccuracy,
  } = useTaskFlow();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null); 

  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleQueueDrop = (taskId) => {
    if (taskId && !todoQueue.find(q => q.id === taskId)) {
      addToQueue(taskId);
    }
  };
  const handleSetDailyTime = (minutes) => {
    updateDailyTimeAvailable(minutes);
  };
  
  const handleAddTasksToQueue = (taskIds) => {
    taskIds.forEach(taskId => {
      addToQueue(taskId);
    });
  };
  
  const getAvailableTasks = () => {
    return tasks.filter(task => 
      !task.done && 
      !todoQueue.find(q => q.id === task.id)
    ).map(task => ({
      ...task,
      projectName: getProjectName(task.projectId)
    }));
  };
  const selectedProject = getProject(selectedProjectId);
  const projectTasks = getProjectTasks(selectedProjectId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 font-sans flex text-gray-800">
      <Sidebar 
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onAddProject={addProject}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}                     
        switchToTasksView={switchToTasksView}        
        switchToDashboardView={switchToDashboardView}
      />
  
{/* Main Content */}
<div className="flex-1 py-8 px-8 space-y-8 lg:ml-0">
  {/* Mobile Menu Button */}
  <button 
    className="lg:hidden mb-6 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-white/20" 
    onClick={() => setSidebarOpen(!sidebarOpen)}
  >
    <span className="mr-2">☰</span> Menu
  </button>

  {/* Conditional Content Based on Current View */}
  {currentView === 'dashboard' ? (
    // Dashboard View
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
      <AccomplishmentDashboard 
        tasks={tasks}
        projects={projects}
        getProjectName={getProjectName}
      />
    </div>
  ) : (
    // Tasks View (existing content)
    <>
      {/* Planning Button */}
      {shouldShowPlanningPrompt() && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 border-2 border-purple-200 shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">🌅 Ready to plan your day?</h3>
              <p className="text-purple-600">Set your available time and get smart task suggestions!</p>
            </div>
            <button
              onClick={openPlanningModal}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              🎯 Plan Day
            </button>
          </div>
        </div>
      )}

      {/* Reflection Prompt */}
      {shouldShowReflectionPrompt() && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-6 border-2 border-green-200 shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-2">🌅 How was your day?</h3>
              <p className="text-green-600">Take a moment to reflect on your productivity and learn for tomorrow!</p>
            </div>
            <button
              onClick={openReflectionModal}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
            >
              📝 Reflect
            </button>
          </div>
        </div>
      )}

      {/* Project Tasks Section */}
      {selectedProject && (
        <section className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-8 border border-white/20">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <span className="mr-3 text-4xl">📁</span> {selectedProject.name}
            </h2>
            <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
              {projectTasks.length} tasks
            </div>
          </div>

          <TaskForm 
            onAddTask={addTask}
            selectedProjectId={selectedProjectId}
          />

          <TimeDisplay tasks={projectTasks} title="📊 Project Overview" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              <span className="mr-2">📋</span> Tasks
            </h3>
            <TaskList
              items={projectTasks}
              onToggle={toggleTaskDone}
              onQueue={addToQueue}
              onUpdateTime={updateTaskTime}
              onUpdateNotes={updateTaskNotes}
              onUpdateName={updateTaskName}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </section>
      )}

      {/* Today's Queue Section */}
      <TodayQueue 
        todoQueue={todoQueue}
        onToggle={toggleTaskDone}
        onRemoveFromQueue={removeFromQueue}
        onUpdateTime={updateTaskTime}
        onUpdateNotes={updateTaskNotes}
        onUpdateName={updateTaskName}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleQueueDrop}
      />
    </>
  )}
</div>
  
      {/* Drag Overlay */}
      {draggedTaskId && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div 
            className="absolute bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            ✨ {tasks.find(t => t.id === draggedTaskId)?.text || "Task"}
          </div>
        </div>
      )}

      {/* Daily Planning Modal */}
      <DailyPlanningModal
        isOpen={planningModalOpen}
        onClose={closePlanningModal}
        onSetDailyTime={handleSetDailyTime}
        currentDailyTime={dailyTimeAvailable}
        availableTasks={getAvailableTasks()}
        onAddTasksToQueue={handleAddTasksToQueue}
      />

      {/* Daily Reflection Modal */}
      <DailyReflectionModal
        isOpen={reflectionModalOpen}
        onClose={closeReflectionModal}
        onSaveReflection={saveReflection}
        todoQueue={todoQueue}
        dailyTimeAvailable={dailyTimeAvailable}
        estimationAccuracy={getEstimationAccuracy()}
      />
    </div>
  );
}

export default App;