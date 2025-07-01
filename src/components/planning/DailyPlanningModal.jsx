import React, { useState } from 'react';
import Modal from '../common/Modal';
import { formatTime, calculateTotalTime } from '../../utils/helpers';

const DailyPlanningModal = ({ 
  isOpen, 
  onClose, 
  onSetDailyTime, 
  currentDailyTime,
  availableTasks,
  onAddTasksToQueue 
}) => {
  const [selectedTime, setSelectedTime] = useState(currentDailyTime);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const handleTimeChange = (e) => {
    setSelectedTime(parseInt(e.target.value));
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getSelectedTasksTime = () => {
    const tasks = availableTasks.filter(t => selectedTasks.includes(t.id));
    return calculateTotalTime(tasks);
  };

  const handlePlanDay = () => {
    onSetDailyTime(selectedTime);
    if (selectedTasks.length > 0) {
      onAddTasksToQueue(selectedTasks);
    }
    onClose();
    setSelectedTasks([]);
  };

  const getRemainingTime = () => {
    return Math.max(0, selectedTime - getSelectedTasksTime());
  };

  const getSuggestedTasks = () => {
    const remainingTime = getRemainingTime();
    return availableTasks
      .filter(t => !selectedTasks.includes(t.id))
      .filter(t => (t.estimatedTime || 0) <= remainingTime)
      .sort((a, b) => {
        // Sort by priority (high first) then by time (shorter first)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return (a.estimatedTime || 0) - (b.estimatedTime || 0);
      })
      .slice(0, 5); // Show top 5 suggestions
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎯 Plan Your Day">
      <div className="space-y-6">
        {/* Time Available Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">⏰ How much time do you have today?</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="60"
                max="720"
                step="30"
                value={selectedTime}
                onChange={handleTimeChange}
                className="flex-grow h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="bg-white px-4 py-2 rounded-xl border-2 border-blue-200 font-bold text-indigo-600 min-w-[100px] text-center">
                {formatTime(selectedTime)}
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>1 hour</span>
              <span>12 hours</span>
            </div>
          </div>
        </div>

        {/* Time Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-100 rounded-xl p-4 text-center">
            <div className="font-bold text-lg text-blue-600">{formatTime(selectedTime)}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-green-100 rounded-xl p-4 text-center">
            <div className="font-bold text-lg text-green-600">{formatTime(getSelectedTasksTime())}</div>
            <div className="text-sm text-gray-600">Planned</div>
          </div>
          <div className="bg-orange-100 rounded-xl p-4 text-center">
            <div className="font-bold text-lg text-orange-600">{formatTime(getRemainingTime())}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        {/* Smart Suggestions */}
        {getSuggestedTasks().length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">💡 Smart Suggestions</h3>
            <div className="space-y-2">
              {getSuggestedTasks().map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between bg-white rounded-xl p-3 border border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer"
                  onClick={() => toggleTaskSelection(task.id)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="font-medium">{task.text}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.priority === 'high' ? 'bg-red-100 text-red-600' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {formatTime(task.estimatedTime || 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePlanDay}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            🚀 Start My Day
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DailyPlanningModal;