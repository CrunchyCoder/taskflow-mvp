import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, done: false }]);
    setNewTask("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">TaskFlow MVP</h1>
        <div className="flex mb-4">
          <input
            className="flex-grow border rounded-l p-2 focus:outline-none"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            onClick={addTask}
          >
            Add
          </button>
        </div>
        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex items-center justify-between mb-2 p-2 rounded ${
                task.done ? "bg-green-100 line-through" : "bg-gray-50"
              }`}
            >
              <span>{task.text}</span>
              <button
                className={`${
                  task.done
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-green-500 hover:text-green-700"
                } font-bold`}
                onClick={() => toggleTask(index)}
              >
                {task.done ? "Undo" : "Done"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
