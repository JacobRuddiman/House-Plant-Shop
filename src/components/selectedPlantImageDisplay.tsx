'use client';

import React from 'react';

interface SelectedPlantImageDisplayProps {
  plantId: number | null;
  imageId: number | null;
  onAppend: () => void;
}

const SelectedPlantImageDisplay: React.FC<SelectedPlantImageDisplayProps> = ({ plantId, imageId, onAppend }) => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Selected Plant and Image</h2>
        <p>Plant ID: {plantId}</p>
        <p>Image ID: {imageId}</p>
        <button 
          onClick={onAppend} 
          className="btn btn-primary mt-4" 
          disabled={!plantId || !imageId}
        >
          Append
        </button>
      </div>
    );
  };

export default SelectedPlantImageDisplay;
