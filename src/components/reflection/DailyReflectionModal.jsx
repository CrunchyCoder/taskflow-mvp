import React, { useState } from 'react';
import Modal from '../common/Modal';
import { formatTime } from '../../utils/helpers';

const DailyReflectionModal = ({ 
  isOpen, 
  onClose, 
  onSaveReflection,
  todoQueue,
  dailyTimeAvailable,
  estimationAccuracy 
}) => {
  const [estimationRating, setEstimationRating] = useState(3);
  const [productivityRating, setProductivityRating] = useState(3);
  const [challenges, setChallenges] = useState('');
  const [wins, setWins] = useState('');
  const [tomorrowFocus, setTomorrowFocus] = useState('');

  const completedTasks = todoQueue.filter(t => t.done);
  const completionRate = todoQueue.length > 0 ? Math.round((completedTasks.length / todoQueue.length) * 100) : 0;
  const totalPlannedTime = todoQueue.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);

  const handleSave = () => {
    onSaveReflection({
      estimationAccuracy: estimationRating,
      productivity: productivityRating,
      challenges: challenges.trim(),
      wins: wins.trim(),
      tomorrowFocus: tomorrowFocus.trim()
    });
    
    // Reset form
    setEstimationRating(3);
    setProductivityRating(3);
    setChallenges('');
    setWins('');
    setTomorrowFocus('');
  };

  const StarRating = ({ rating, setRating, label }) => (
    <div className="space-y-2">
      <label className="font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ⭐
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500">
        {rating === 1 && "Poor"} 
        {rating === 2 && "Fair"} 
        {rating === 3 && "Good"} 
        {rating === 4 && "Very Good"} 
        {rating === 5 && "Excellent"}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🌅 Daily Reflection">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        
        {/* Today's Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">📊 Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{formatTime(totalPlannedTime)}</div>
              <div className="text-sm text-gray-600">Time Planned</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{formatTime(dailyTimeAvailable)}</div>
              <div className="text-sm text-gray-600">Time Available</div>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">⭐ How did today go?</h3>
          <div className="space-y-6">
            <StarRating 
              rating={estimationRating}
              setRating={setEstimationRating}
              label="Time Estimation Accuracy"
            />
            <StarRating 
              rating={productivityRating}
              setRating={setProductivityRating}
              label="Overall Productivity"
            />
          </div>
        </div>

        {/* Reflection Questions */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">🚧 What were your main challenges today?</label>
            <textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="e.g., Interruptions, underestimated task complexity, lack of focus..."
              className="w-full border-2 border-gray-200 rounded-2xl p-4 bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">🎉 What went really well today?</label>
            <textarea
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              placeholder="e.g., Completed important task early, stayed focused, good time management..."
              className="w-full border-2 border-gray-200 rounded-2xl p-4 bg-white focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">🎯 What's your main focus for tomorrow?</label>
            <textarea
              value={tomorrowFocus}
              onChange={(e) => setTomorrowFocus(e.target.value)}
              placeholder="e.g., Start with most important task, block distractions, prepare materials..."
              className="w-full border-2 border-gray-200 rounded-2xl p-4 bg-white focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all resize-none"
              rows="3"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Skip for Now
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            💾 Save Reflection
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DailyReflectionModal;