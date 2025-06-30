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
    <div className="border-t pt-4">
      <form onSubmit={handleSubmit}>
        <input
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="New project name"
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          ➕ Add Project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;