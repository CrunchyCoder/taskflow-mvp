import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todoQueue, setTodoQueue] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");

  const addProject = () => {
    if (!newProjectName.trim()) return;
    setProjects([
      ...projects,
      { id: uuidv4(), name: newProjectName, color: "#B49A7A" }
    ]);
    setNewProjectName("");
  };

  const addTask = () => {
    if (!newTaskText.trim() || !selectedProjectId) return;
    setTasks([
      ...tasks,
      {
        id: uuidv4(),
        projectId: selectedProjectId,
        text: newTaskText,
        done: false,
        estimatedTime: 30,
      }
    ]);
    setNewTaskText("");
  };

  const toggleTaskDone = (taskId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, done: !t.done } : t
    ));
  };

  const addToTodoQueue = (taskId) => {
    if (!todoQueue.includes(taskId)) {
      setTodoQueue([...todoQueue, taskId]);
    }
  };

  const getProjectName = (projectId) =>
    projects.find((p) => p.id === projectId)?.name || "Unknown";

  return (
    <div className="min-h-screen bg-ash py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-clay mb-6">TaskFlow</h1>

        {/* Project Card */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-moss">Projects</h2>
          <div className="flex gap-2">
            <input
              className="flex-grow border border-sand rounded p-2 focus:outline-moss"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <button
              onClick={addProject}
              className="bg-moss text-white px-4 py-2 rounded hover:bg-sage"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => (
              <button
                key={project.id}
                className={`px-4 py-1 rounded-xl text-white font-semibold transition ${
                  selectedProjectId === project.id ? "opacity-100" : "opacity-60"
                }`}
                style={{ backgroundColor: project.color }}
                onClick={() => setSelectedProjectId(project.id)}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>

        {/* Task Card */}
        {selectedProjectId && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-terracotta">
              Tasks for {getProjectName(selectedProjectId)}
            </h2>
            <div className="flex gap-2">
              <input
                className="flex-grow border border-sand rounded p-2 focus:outline-none"
                placeholder="New task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
              />
              <button
                onClick={addTask}
                className="bg-terracotta text-white px-4 py-2 rounded hover:bg-clay"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {tasks
                .filter((t) => t.projectId === selectedProjectId)
                .map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center bg-sand rounded-xl p-3 shadow-sm"
                  >
                    <span className={task.done ? "line-through text-gray-400" : ""}>
                      {task.text}
                    </span>
                    <div className="space-x-3">
                      <button
                        onClick={() => addToTodoQueue(task.id)}
                        className="text-blue-600 text-sm"
                      >
                        ➕ Queue
                      </button>
                      <button
                        onClick={() => toggleTaskDone(task.id)}
                        className="text-green-600 text-sm"
                      >
                        {task.done ? "Undo" : "Done"}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* To-Do Queue Card */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-clay">📋 Today's Queue</h2>
          {todoQueue.length === 0 ? (
            <p className="text-gray-500">No tasks added to today’s queue.</p>
          ) : (
            <ul className="space-y-2">
              {todoQueue.map((taskId) => {
                const task = tasks.find((t) => t.id === taskId);
                if (!task) return null;
                return (
                  <li
                    key={task.id}
                    className="flex justify-between items-center bg-sage/30 rounded-xl p-3"
                  >
                    <span>{task.text}</span>
                    <span className="text-sm text-gray-600">
                      {task.estimatedTime} min
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
