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
      className="flex justify-between items-center bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all border border-white/40 cursor-grab active:cursor-grabbing transform hover:scale-[1.02] hover:-translate-y-1"
    >
      <span className="mr-4 text-2xl text-gray-400">⋮⋮</span>
      {children}
    </li>
  );
};

export default DraggableTask;