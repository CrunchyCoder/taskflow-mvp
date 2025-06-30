import { useState, useEffect } from 'react';
import { generateId } from '../utils/helpers';

// Helper functions for localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log('Could not save to storage:', error);
  }
};

const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.log('Could not load from storage:', error);
    return defaultValue;
  }
};

export const useTaskFlow = () => {
  // Load data from localStorage or use defaults
  const [projects, setProjects] = useState(() => 
    loadFromStorage('taskflow-projects', [
      { id: 'demo-1', name: 'Demo Project', description: 'Sample project', tags: ['demo'] }
    ])
  );
  
  const [tasks, setTasks] = useState(() =>
    loadFromStorage('taskflow-tasks', [
      {
        id: 'task-1',
        projectId: 'demo-1',
        text: 'Review project requirements',
        done: false,
        priority: 'high',
        estimatedTime: 30,
        tags: ['planning'],
        dueDate: null
      },
      {
        id: 'task-2',
        projectId: 'demo-1',
        text: 'Write initial documentation',
        done: true,
        priority: 'medium',
        estimatedTime: 60,
        tags: ['docs'],
        dueDate: null
      }
    ])
  );
  
  const [todoQueue, setTodoQueue] = useState(() =>
    loadFromStorage('taskflow-queue', [])
  );
  
  const [selectedProjectId, setSelectedProjectId] = useState(() =>
    loadFromStorage('taskflow-selected-project', 'demo-1')
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage('taskflow-projects', projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage('taskflow-tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('taskflow-queue', todoQueue);
  }, [todoQueue]);

  useEffect(() => {
    saveToStorage('taskflow-selected-project', selectedProjectId);
  }, [selectedProjectId]);

  // Project operations
  const addProject = (name) => {
    if (!name.trim()) return;
    const newProject = {
      id: generateId(),
      name: name.trim(),
      description: "",
      tags: []
    };
    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  };

  const getProject = (projectId) => {
    return projects.find(p => p.id === projectId);
  };

  const getProjectName = (projectId) => {
    return projects.find(p => p.id === projectId)?.name || "Unknown";
  };

  // Task operations
  const addTask = (taskData) => {
    if (!taskData.text.trim() || !taskData.projectId) return;
    const newTask = {
      id: generateId(),
      projectId: taskData.projectId,
      text: taskData.text.trim(),
      done: false,
      priority: taskData.priority || 'medium',
      estimatedTime: parseInt(taskData.estimatedTime) || 0,
      tags: taskData.tags || [],
      dueDate: taskData.dueDate || null
    };
    setTasks(prev => [...prev, newTask]);
    return newTask.id;
  };

  const toggleTaskDone = (taskId) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    ));
    setTodoQueue(prev => prev.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    ));
  };

  const updateTaskTime = (taskId, estimatedTime) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, estimatedTime } : t
    ));
    setTodoQueue(prev => prev.map(t => 
      t.id === taskId ? { ...t, estimatedTime } : t
    ));
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(t => t.projectId === projectId);
  };

  // Queue operations
  const addToQueue = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !todoQueue.find(q => q.id === taskId)) {
      const taskWithProject = {
        ...task,
        projectName: getProjectName(task.projectId)
      };
      setTodoQueue(prev => [...prev, taskWithProject]);
    }
  };

  const removeFromQueue = (taskId) => {
    setTodoQueue(prev => prev.filter(t => t.id !== taskId));
  };

  const updateTaskNotes = (taskId, notes) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, notes } : t
    ));
    setTodoQueue(prev => prev.map(t => 
      t.id === taskId ? { ...t, notes } : t
    ));
  };

  const updateTaskName = (taskId, newName) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, text: newName } : t
    ));
    setTodoQueue(prev => prev.map(t => 
      t.id === taskId ? { ...t, text: newName } : t
    ));
  };
  return {
    // State
    projects,
    tasks,
    todoQueue,
    selectedProjectId,
    
    // Setters
    setSelectedProjectId,
    
    // Project operations
    addProject,
    getProject,
    getProjectName,
    
    // Task operations
    addTask,
    toggleTaskDone,
    updateTaskTime,
    updateTaskNotes,
    updateTaskName,
    getProjectTasks,
    
    // Queue operations
    addToQueue,
    removeFromQueue
  };
};