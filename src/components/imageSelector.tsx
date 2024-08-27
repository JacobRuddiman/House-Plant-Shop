'use client';

import React, { useState, useEffect } from 'react';
import { getImages } from '@/server/images';

interface ImageSelectorProps {
  onSelect: (imageId: number) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onSelect }) => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const result = await getImages();
      if(result.images){
        setImages(result.images);
      } else {
        setImages([])
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select Image</h2>
      <div className="grid grid-cols-6 gap-4">
        {images.map(image => (
          <div key={image.id} className="card bordered shadow-lg">
            <figure>
              <img 
                src={image.url} 
                alt={`Image ${image.id}`} 
                onClick={() => onSelect(image.id)}
                className="cursor-pointer"
              />
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelector;
