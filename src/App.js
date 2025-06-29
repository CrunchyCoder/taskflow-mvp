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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addProject = () => {
    if (!newProjectName.trim()) return;
    setProjects([
      ...projects,
      { id: uuidv4(), name: newProjectName, color: "#B49A7A" },
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
      },
    ]);
    setNewTaskText("");
  };

  const toggleTaskDone = (taskId) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
  };

  const addToTodoQueue = (taskId) => {
    if (!todoQueue.includes(taskId)) {
      setTodoQueue([...todoQueue, taskId]);
    }
  };

  const getProjectName = (projectId) =>
    projects.find((p) => p.id === projectId)?.name || "Unknown";

  return (
    <div className="min-h-screen bg-ash font-sans flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-sand p-6 shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-bold text-clay mb-4">TaskFlow</h2>
        <div className="space-y-2">
          {projects.map((project) => (
            <button
              key={project.id}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium text-white transition ${
                selectedProjectId === project.id ? "bg-moss" : "bg-clay hover:bg-moss"
              }`}
              onClick={() => {
                setSelectedProjectId(project.id);
                setSidebarOpen(false);
              }}
            >
              {project.name}
            </button>
          ))}
        </div>
        <div className="mt-6">
          <input
            className="w-full border border-sand rounded p-2 mb-2"
            placeholder="New project"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            onClick={addProject}
            className="w-full bg-moss text-white px-4 py-2 rounded hover:bg-sage"
          >
            Add Project
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-64 py-10 px-6 space-y-10">
        {/* Toggle button */}
        <button
          className="lg:hidden mb-4 text-clay font-semibold"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰ Menu
        </button>

        {selectedProjectId && (
          <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
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
                className="bg-terracotta text-white px-4 py-2 rounded-xl hover:bg-clay"
              >
                Add
              </button>
            </div>
            <ul className="space-y-3">
              {tasks
                .filter((t) => t.projectId === selectedProjectId)
                .map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center bg-sand rounded-xl p-3 shadow-sm"
                  >
                    <span
                      className={
                        task.done ? "line-through text-gray-400" : "text-gray-700"
                      }
                    >
                      {task.text}
                    </span>
                    <div className="space-x-3">
                      <button
                        onClick={() => addToTodoQueue(task.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ➕ Queue
                      </button>
                      <button
                        onClick={() => toggleTaskDone(task.id)}
                        className="text-sm text-green-600 hover:underline"
                      >
                        {task.done ? "Undo" : "Done"}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* To-Do Queue */}
        <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
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
        </section>
      </div>
    </div>
  );
}

export default App;
