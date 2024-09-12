'use client';

import React, { useState, useEffect } from 'react';
import { getImages } from '@/server/images';
import ImageCardWithDelete from './imageCardWithDelete';

interface ImageSelectorProps {
  onSelect: (imageId: number) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onSelect }) => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const result = await getImages();
      if (result.images) {
        setImages(result.images);
      } else {
        setImages([]);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = (deletedImageId: number) => {
    setImages(prevImages => prevImages.filter(image => image.id !== deletedImageId));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select Image</h2>
      <div className="grid grid-cols-6 gap-4">
        {images.map(image => (
          <ImageCardWithDelete
            key={image.id}
            imageId={image.id}
            imageUrl={image.url}
            onSelect={onSelect}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSelector;
