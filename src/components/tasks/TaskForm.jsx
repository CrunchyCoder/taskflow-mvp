import React, { useState } from 'react';
import { PRIORITY_OPTIONS } from '../../utils/constants';

const TaskForm = ({ onAddTask, selectedProjectId }) => {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskTime, setNewTaskTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !selectedProjectId) return;
    
    onAddTask({
      text: newTaskText,
      projectId: selectedProjectId,
      priority: newTaskPriority,
      estimatedTime: newTaskTime
    });
    
    setNewTaskText("");
    setNewTaskTime("");
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-6 border-2 border-blue-200 shadow-2xl mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 flex-wrap">
          <input
            className="flex-grow min-w-0 border-2 border-blue-200 rounded-2xl p-4 bg-white focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all placeholder-gray-500 shadow-lg"
            placeholder="✨ What needs to be done?"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            required
          />
          <select 
            value={newTaskPriority}
            onChange={e => setNewTaskPriority(e.target.value)}
            className="border-2 border-blue-200 rounded-2xl px-4 py-2 bg-white focus:ring-4 focus:ring-indigo-200 font-medium shadow-lg"
          >
            {PRIORITY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="⏱️ Min"
            value={newTaskTime}
            onChange={e => setNewTaskTime(e.target.value)}
            className="w-24 border-2 border-blue-200 rounded-2xl px-3 py-2 bg-white focus:ring-4 focus:ring-indigo-200 shadow-lg"
          />
          <button 
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all font-bold whitespace-nowrap shadow-xl hover:scale-105"
          >
            <span className="mr-2">✨</span> Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;