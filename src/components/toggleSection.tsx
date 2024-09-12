"use client";
import React, { useState } from 'react';

interface ToggleSectionProps {
  title: string;
  children: React.ReactNode;
}

const ToggleSection: React.FC<ToggleSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center bg-gray-200 p-2 rounded-t">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={toggleOpen} className="btn btn-secondary">
          {isOpen ? 'Close' : 'Open'}
        </button>
      </div>
      {isOpen && (
        <div className="p-4 bg-white rounded-b shadow-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default ToggleSection;
