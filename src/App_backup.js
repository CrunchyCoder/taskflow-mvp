import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from "@dnd-kit/core";
import {
  useSortable
} from "@dnd-kit/sortable";

function DraggableTask({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    cursor: "grab"
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex justify-between items-center bg-sand rounded-xl p-4 shadow-md hover:shadow-lg transition"
    >
      <span className="mr-3 text-xl text-gray-400">⋮</span>
      {children}
    </li>
  );
}

function TaskList({ items, onToggle, onQueue, isQueue = false }) {
  return (
    <ul className="space-y-3">
      {items.map(item => (
        <DraggableTask key={item.id} id={item.id}>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <span className={`text-lg ${item.done ? "line-through text-gray-400" : "text-gray-800"}`}>
                {item.text}
              </span>
              <div className="space-x-2 text-sm">
                <button
                  onClick={() => onQueue(item.id)}
                  className={`px-3 py-1 rounded-full border ${
                    isQueue ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100" : "border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  {isQueue ? "✖ Remove" : "➕ Queue"}
                </button>
                <button
                  onClick={() => onToggle(item.id)}
                  className="px-3 py-1 rounded-full border border-green-300 text-green-600 bg-green-50 hover:bg-green-100"
                >
                  {item.done ? "Undo" : "Done"}
                </button>
              </div>
            </div>
          </div>
        </DraggableTask>
      ))}
    </ul>
  );
}

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todoQueue, setTodoQueue] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));
  const { setNodeRef: queueRef } = useDroppable({ id: "TODAY_QUEUE" });

  const addProject = () => {
    if (!newProjectName.trim()) return;
    setProjects([...projects, { id: uuidv4(), name: newProjectName, description: "", tags: [] }]);
    setNewProjectName("");
  };

  const addTask = () => {
    if (!newTaskText.trim() || !selectedProjectId) return;
    const newTask = {
      id: uuidv4(),
      projectId: selectedProjectId,
      text: newTaskText,
      done: false,
      priority: "medium",
      dueDate: null
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const toggleTaskDone = taskId => {
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, done: !t.done } : t)));
    setTodoQueue(queue => queue.map(t => (t.id === taskId ? { ...t, done: !t.done } : t)));
  };

  const addToTodoQueue = taskId => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !todoQueue.find(q => q.id === taskId)) {
      setTodoQueue([...todoQueue, task]);
    }
  };

  const removeFromTodoQueue = taskId => {
    setTodoQueue(queue => queue.filter(t => t.id !== taskId));
  };

  const getProjectName = projectId => {
    return projects.find(p => p.id === projectId)?.name || "Unknown";
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (activeTask && over.id === "TODAY_QUEUE") {
      addToTodoQueue(active.id);
    }
    setActiveId(null);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-ash font-sans flex text-gray-800">
        <div className={`fixed top-0 left-0 h-full w-64 bg-sand p-6 shadow-lg transform transition-transform duration-300 lg:relative ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <h2 className="text-3xl font-bold text-clay mb-6">TaskFlow</h2>
          <div className="space-y-2">
            {projects.map(project => (
              <button
                key={project.id}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                  selectedProjectId === project.id ? "bg-moss text-white" : "bg-clay text-white hover:bg-moss"
                }`}
                onClick={() => { setSelectedProjectId(project.id); setSidebarOpen(false); }}
              >
                {project.name}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <input
              className="w-full border border-sand rounded p-2 mb-2 bg-white"
              placeholder="New project"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
            />
            <button onClick={addProject} className="w-full bg-moss text-white px-4 py-2 rounded hover:bg-sage">
              Add Project
            </button>
          </div>
        </div>

        <div className="flex-1 ml-0 lg:ml-64 py-10 px-6 space-y-10">
          <button className="lg:hidden mb-4 text-clay font-semibold" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰ Menu
          </button>

          {selectedProjectId && (
            <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-terracotta">Tasks for {getProjectName(selectedProjectId)}</h2>
              <div className="flex gap-2">
                <input
                  className="flex-grow border border-sand rounded p-2 bg-white focus:outline-none"
                  placeholder="New task..."
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                />
                <button onClick={addTask} className="bg-terracotta text-white px-4 py-2 rounded-xl hover:bg-clay">
                  Add Task
                </button>
              </div>
              <TaskList
                items={tasks.filter(t => t.projectId === selectedProjectId)}
                onToggle={toggleTaskDone}
                onQueue={addToTodoQueue}
              />
            </section>
          )}

          <section ref={queueRef} id="TODAY_QUEUE" className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-clay">📋 Today's Queue</h2>
            {todoQueue.length === 0 ? (
              <p className="text-gray-500">No tasks in queue.</p>
            ) : (
              <TaskList
                items={todoQueue}
                onToggle={toggleTaskDone}
                onQueue={removeFromTodoQueue}
                isQueue
              />
            )}
          </section>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="px-4 py-2 bg-sage text-white rounded shadow">
            {tasks.find(t => t.id === activeId)?.text || "Task"}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
