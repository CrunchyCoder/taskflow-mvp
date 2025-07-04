import React from 'react';
import ProjectList from '../projects/ProjectList';
import ProjectForm from '../projects/ProjectForm';

const Sidebar = ({ 
  projects, 
  selectedProjectId, 
  onSelectProject, 
  onAddProject,
  isOpen, 
  onClose,
  currentView,           
  switchToTasksView,       
  switchToDashboardView   
}) => {
  const handleSelectProject = (projectId) => {
    onSelectProject(projectId);
    onClose();
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-xl p-6 shadow-2xl transform transition-transform duration-300 lg:relative border-r border-white/30 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <h2 className="text-3xl font-bold mb-8 flex items-center">
    <span className="mr-3 text-4xl">🎯</span>
    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      TaskFlow
    </span>
    </h2>
  
  {/* Navigation Tabs */}
  <div className="space-y-2 mb-6">
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
              currentView === 'dashboard'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              switchToDashboardView();
              onClose();
            }}
          >
            📊 Dashboard
          </button>

          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
              currentView === 'tasks'
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              switchToTasksView();
              onClose();
            }}
          >
            📋 Tasks
          </button>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>
        </div>

        <ProjectList 
    projects={projects}
    selectedProjectId={selectedProjectId}
    onSelectProject={handleSelectProject}
  />
  
        <ProjectForm onAddProject={onAddProject} />
</div>  

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;