export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  export const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  export const calculateTotalTime = (tasks) => {
    return tasks.reduce((total, task) => total + (task.estimatedTime || 0), 0);
  };
  
  export const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };