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
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 flex-wrap">
          <input
            className="flex-grow min-w-0 border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What needs to be done?"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            required
          />
          <select 
            value={newTaskPriority}
            onChange={e => setNewTaskPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
          >
            {PRIORITY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Minutes"
            value={newTaskTime}
            onChange={e => setNewTaskTime(e.target.value)}
            className="w-24 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;