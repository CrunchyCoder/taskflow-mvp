import React, { useState } from 'react';
import Modal from '../common/Modal';
import { formatTime } from '../../utils/helpers';

const TaskCompletionModal = ({ 
  isOpen, 
  onClose, 
  task, 
  actualTime, 
  onSaveFeedback 
}) => {
  const [accuracy, setAccuracy] = useState(3); // 1-5 scale
  const [notes, setNotes] = useState('');
  const [delayReason, setDelayReason] = useState('');

  const estimatedTime = task?.estimatedTime || 0;
  const timeDiff = actualTime - estimatedTime;
  const isOverEstimate = timeDiff > 0;

  // Delay reason options
  const delayReasons = [
    'Over Optimistic estimate',
    'Got Distracted', 
    'Blocked by Dependency',
    'More complex than expected',
    'Learning to complete task',
    'Other'
  ];

  const handleSave = () => {
    const feedbackData = {
      taskId: task.id,
      estimatedTime,
      actualTime,
      accuracy,
      notes: notes.trim(),
      timeDiff,
      delayReason: isOverEstimate ? delayReason : null
    };
    
    onSaveFeedback(feedbackData);
    onClose();
    setAccuracy(3);
    setNotes('');
    setDelayReason('');
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          ⏰ Task Complete!
        </h2>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-5 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">{task.text}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Estimated: {formatTime(estimatedTime)}
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Actual: {formatTime(actualTime)}
            </div>
            <div className={`font-medium flex items-center ${isOverEstimate ? 'text-orange-600' : 'text-green-600'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isOverEstimate ? 'bg-orange-400' : 'bg-green-400'}`}></span>
              {isOverEstimate ? '+' : ''}{timeDiff} min vs estimate
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Rating Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How realistic was your estimate?
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setAccuracy(rating)}
                  className={`w-12 h-12 rounded-full transition-all duration-200 font-semibold text-sm ${
                    accuracy === rating 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">1 = Way off • 5 = Spot on</div>
          </div>

          {/* Conditional Delay Reason Section */}
          {isOverEstimate && (
            <div className="animate-fade-in">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Why did it take longer than expected?
              </label>
              <select
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl bg-white text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25rem 1.25rem'
                }}
              >
                <option value="">Select a reason...</option>
                {delayReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quick note (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn? Any insights for next time?"
              className="w-full p-4 border border-gray-200 rounded-2xl text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              rows="3"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg"
          >
            Save Feedback
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </Modal>
  );
};

export default TaskCompletionModal;