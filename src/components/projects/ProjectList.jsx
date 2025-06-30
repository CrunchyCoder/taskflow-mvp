import React from 'react';

const ProjectList = ({ projects, selectedProjectId, onSelectProject }) => {
  return (
    <div className="space-y-2 mb-6">
      {projects.map(project => (
        <button
          key={project.id}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
            selectedProjectId === project.id 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => onSelectProject(project.id)}
        >
          📁 {project.name}
        </button>
      ))}
    </div>
  );
};

export default ProjectList;