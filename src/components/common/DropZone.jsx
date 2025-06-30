import React, { useState } from 'react';

const DropZone = ({ onDrop, children, className = "" }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    setIsDragOver(false);
    if (onDrop) onDrop(taskId);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${className} ${isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50' : ''} transition-all`}
    >
      {children}
    </div>
  );
};

export default DropZone;