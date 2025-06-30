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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans flex text-gray-800">
      <Sidebar 
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onAddProject={addProject}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 py-6 px-6 space-y-6 lg:ml-0">
        <button 
          className="lg:hidden mb-4 text-gray-700 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰ Menu
        </button>

        {/* Project Tasks Section */}
        {selectedProject && (
          <section className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                📁 {selectedProject.name}
              </h2>
              <span className="text-sm text-gray-500">
                {projectTasks.length} tasks
              </span>
            </div>

            <TaskForm 
              onAddTask={addTask}
              selectedProjectId={selectedProjectId}
            />

            <TimeDisplay tasks={projectTasks} title="📊 Project Overview" />

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
            className="absolute bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg border border-blue-700 opacity-75"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {tasks.find(t => t.id === draggedTaskId)?.text || "Task"}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;