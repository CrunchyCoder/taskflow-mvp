import React from 'react';

const DraggableTask = ({ id, children, onDragStart, onDragEnd }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    if (onDragStart) onDragStart(id);
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd();
  };

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex justify-between items-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 shadow-md hover:shadow-lg transition border border-orange-100 cursor-grab active:cursor-grabbing"
    >
      <span className="mr-3 text-xl text-gray-400">⋮</span>
      {children}
    </li>
  );
};

export default DraggableTask;