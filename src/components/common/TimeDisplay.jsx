import React from 'react';
import { formatTime, calculateTotalTime } from '../../utils/helpers';

const TimeDisplay = ({ tasks, title }) => {
  const totalTime = calculateTotalTime(tasks);
  const completedTime = calculateTotalTime(tasks.filter(t => t.done));
  const remainingTime = totalTime - completedTime;

  return (
    <div className="bg-gradient-to-r from-indigo-50/90 to-purple-50/90 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-lg">
      <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{title}</h3>
      <div className="grid grid-cols-3 gap-6 text-sm">
        <div className="text-center bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="font-bold text-2xl bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">{formatTime(totalTime)}</div>
          <div className="text-gray-600 font-medium">Total</div>
        </div>
        <div className="text-center bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="font-bold text-2xl bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{formatTime(completedTime)}</div>
          <div className="text-gray-600 font-medium">Done</div>
        </div>
        <div className="text-center bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{formatTime(remainingTime)}</div>
          <div className="text-gray-600 font-medium">Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;