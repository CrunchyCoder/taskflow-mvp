import React, { useState } from 'react';
import { useTaskFlow } from './hooks/useTaskFlow';
import Sidebar from './components/layout/Sidebar';
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import TimeDisplay from './components/common/TimeDisplay';
import TodayQueue from './components/queue/TodayQueue';

function App() {
  const {
    projects,
    tasks,
    todoQueue,
    selectedProjectId,
    setSelectedProjectId,
    addProject,
    getProject,
    addTask,
    toggleTaskDone,
    updateTaskTime,
    updateTaskNotes,
    updateTaskName,
    getProjectTasks,
    addToQueue,
    removeFromQueue
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
    </div>
  );
}

export default App;