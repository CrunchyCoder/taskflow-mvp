import React from 'react';

const ProjectList = ({ projects, selectedProjectId, onSelectProject }) => {
  return (
    <div className="space-y-3 mb-8">
      {projects.map(project => (
        <button
          key={project.id}
          className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all transform hover:scale-105 ${
            selectedProjectId === project.id 
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl" 
              : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 shadow-lg border border-white/40"
          }`}
          onClick={() => onSelectProject(project.id)}
        >
          <div className="flex items-center">
            <span className="mr-3 text-xl">📁</span>
            <span className="font-semibold">{project.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProjectList;