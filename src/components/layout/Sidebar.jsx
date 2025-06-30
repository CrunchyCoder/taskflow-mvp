import React from 'react';
import ProjectList from '../projects/ProjectList';
import ProjectForm from '../projects/ProjectForm';

const Sidebar = ({ 
  projects, 
  selectedProjectId, 
  onSelectProject, 
  onAddProject,
  isOpen, 
  onClose 
}) => {
  const handleSelectProject = (projectId) => {
    onSelectProject(projectId);
    onClose();
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white p-6 shadow-xl transform transition-transform duration-300 lg:relative border-r border-gray-200 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🎯</span>
          TaskFlow
        </h2>
        
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