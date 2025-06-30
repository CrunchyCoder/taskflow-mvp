import React from 'react';
import { formatTime, calculateTotalTime } from '../../utils/helpers';

const TimeDisplay = ({ tasks, title }) => {
  const totalTime = calculateTotalTime(tasks);
  const completedTime = calculateTotalTime(tasks.filter(t => t.done));
  const remainingTime = totalTime - completedTime;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <h3 className="font-semibold text-blue-800 mb-2">{title}</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-bold text-lg text-gray-800">{formatTime(totalTime)}</div>
          <div className="text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-green-600">{formatTime(completedTime)}</div>
          <div className="text-gray-600">Done</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-orange-600">{formatTime(remainingTime)}</div>
          <div className="text-gray-600">Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;