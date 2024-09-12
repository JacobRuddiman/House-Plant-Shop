'use client';

import React from 'react';
import { deleteImage } from '@/server/images';  // Assuming the deleteImage function is already defined

interface ImageCardWithDeleteProps {
  imageId: number;
  imageUrl: string;
  onDelete: (imageId: number) => void;
  onSelect: (imageId: number) => void;
}

const ImageCardWithDelete: React.FC<ImageCardWithDeleteProps> = ({ imageId, imageUrl, onDelete, onSelect }) => {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(imageId);
        onDelete(imageId);  // Notify parent component about deletion
      } catch (error) {
        console.error('Failed to delete image', error);
      }
    }
  };

  return (
    <div className="relative card bordered shadow-lg">
      <figure>
        <img 
          src={imageUrl} 
          alt={`Image ${imageId}`} 
          onClick={() => onSelect(imageId)} 
          className="cursor-pointer"
        />
      </figure>
      <button 
        className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full"
        onClick={handleDelete}
      >
        X
      </button>
    </div>
  );
};

export default ImageCardWithDelete;
