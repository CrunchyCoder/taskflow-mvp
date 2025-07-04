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

  // Daily planning state
  const [dailyTimeAvailable, setDailyTimeAvailable] = useState(() =>
    loadFromStorage('taskflow-daily-time', 480) // Default 8 hours = 480 minutes
  );

  const [planningModalOpen, setPlanningModalOpen] = useState(false);

  const [lastPlanningDate, setLastPlanningDate] = useState(() =>
    loadFromStorage('taskflow-last-planning', null)
  );

  // End-of-day reflection state
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);

  const [dailyReflections, setDailyReflections] = useState(() =>
    loadFromStorage('taskflow-reflections', [])
  );

  const [todayReflection, setTodayReflection] = useState(() => {
    const today = new Date().toDateString();
    const existing = loadFromStorage('taskflow-reflections', []);
    return existing.find(r => r.date === today) || null;
  });

  // Dashboard state
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks' or 'dashboard'

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

  useEffect(() => {
    saveToStorage('taskflow-daily-time', dailyTimeAvailable);
  }, [dailyTimeAvailable]);

  useEffect(() => {
    saveToStorage('taskflow-last-planning', lastPlanningDate);
  }, [lastPlanningDate]);

  useEffect(() => {
    saveToStorage('taskflow-reflections', dailyReflections);
  }, [dailyReflections]);

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
    const now = new Date().toISOString();
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { 
        ...t, 
        done: !t.done,
        completedAt: !t.done ? now : null  // Set timestamp when marking done, clear when undoing
      } : t
    ));
    setTodoQueue(prev => prev.map(t => 
      t.id === taskId ? { 
        ...t, 
        done: !t.done,
        completedAt: !t.done ? now : null
      } : t
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

  // Daily planning functions
  const updateDailyTimeAvailable = (minutes) => {
    setDailyTimeAvailable(minutes);
    
    // Mark today as planned
    const today = new Date().toDateString();
    setLastPlanningDate(today);
  };

  const openPlanningModal = () => {
    setPlanningModalOpen(true);
  };

  const closePlanningModal = () => {
    setPlanningModalOpen(false);
  };

  const shouldShowPlanningPrompt = () => {
    const today = new Date().toDateString();
    return lastPlanningDate !== today && todoQueue.length === 0;
  };

  // Reflection functions
  const openReflectionModal = () => {
    setReflectionModalOpen(true);
  };

  const closeReflectionModal = () => {
    setReflectionModalOpen(false);
  };

  const saveReflection = (reflectionData) => {
    const today = new Date().toDateString();
    const newReflection = {
      id: generateId(),
      date: today,
      plannedTime: dailyTimeAvailable,
      completedTasks: todoQueue.filter(t => t.done).length,
      totalTasks: todoQueue.length,
      estimationAccuracy: reflectionData.estimationAccuracy,
      productivity: reflectionData.productivity,
      challenges: reflectionData.challenges,
      wins: reflectionData.wins,
      tomorrowFocus: reflectionData.tomorrowFocus
    };

    setDailyReflections(prev => {
      const filtered = prev.filter(r => r.date !== today);
      return [...filtered, newReflection];
    });
    
    setTodayReflection(newReflection);
    closeReflectionModal();
  };

  const shouldShowReflectionPrompt = () => {
    const today = new Date().toDateString();
    const completedToday = todoQueue.filter(t => t.done).length;
    return !todayReflection && completedToday > 0 && todoQueue.length > 0;
  };

  const getEstimationAccuracy = () => {
    const completedTasks = todoQueue.filter(t => t.done && t.estimatedTime > 0);
    if (completedTasks.length === 0) return null;
    
    // This is a simplified calculation - in reality you'd track actual time spent
    const avgEstimate = completedTasks.reduce((sum, t) => sum + t.estimatedTime, 0) / completedTasks.length;
    return Math.round(avgEstimate);
  };

  // Dashboard functions
const switchToTasksView = () => {
  setCurrentView('tasks');
};

const switchToDashboardView = () => {
  setCurrentView('dashboard');
};

  return {
    // State
    projects,
    tasks,
    todoQueue,
    selectedProjectId,
    dailyTimeAvailable,
    planningModalOpen,
    lastPlanningDate,
    currentView,
    
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
    removeFromQueue,
    
    // Daily planning functions
    updateDailyTimeAvailable,
    openPlanningModal,
    closePlanningModal,
    shouldShowPlanningPrompt,
    
    // Reflection functions
    reflectionModalOpen,
    dailyReflections,
    todayReflection,
    openReflectionModal,
    closeReflectionModal,
    saveReflection,
    shouldShowReflectionPrompt,
    getEstimationAccuracy,

    // Dashboard functions
    currentView,
    switchToTasksView,
    switchToDashboardView,
  };
};