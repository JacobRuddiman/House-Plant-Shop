'use client';

import React, { useState, useEffect } from 'react';
import PlantSelector from './plantSelector';
import ImageSelector from './imageSelector';
import SelectedPlantImageDisplay from './selectedPlantImageDisplay';
import { updateImagePlantId } from '../server/images';

const AppendImageToPlant: React.FC = () => {
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleAppend = async () => {
    if (selectedPlant && selectedImage) {
      await updateImagePlantId({ imageId: selectedImage, plantId: selectedPlant });
      alert('Image appended to plant successfully');
    }
  };

  return (
    <div className="space-y-4 p-4 bg-base-100 rounded-box shadow-md">
      <h1 className="text-2xl font-bold">Append Image to Plant</h1>
      <PlantSelector onSelect={setSelectedPlant} />
      <ImageSelector onSelect={setSelectedImage} />
      <SelectedPlantImageDisplay 
        plantId={selectedPlant} 
        imageId={selectedImage} 
        onAppend={handleAppend} 
      />
    </div>
  );
};

export default AppendImageToPlant;
