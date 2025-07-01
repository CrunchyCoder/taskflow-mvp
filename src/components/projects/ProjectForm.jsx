import React, { useState } from 'react';

const ProjectForm = ({ onAddProject }) => {
  const [newProjectName, setNewProjectName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    onAddProject(newProjectName);
    setNewProjectName("");
  };

  return (
    <div className="border-t border-white/30 pt-6">
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border border-white/40 rounded-2xl p-4 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
        placeholder="✨ New project name"
        value={newProjectName}
        onChange={e => setNewProjectName(e.target.value)}
        required
      />
      <button 
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all font-semibold shadow-lg transform hover:scale-105"
      >
        <span className="mr-2">➕</span> Add Project
      </button>
    </form>
  </div>
  );
};

export default ProjectForm;