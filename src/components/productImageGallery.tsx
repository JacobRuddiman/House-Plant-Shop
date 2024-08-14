"use client";
import React, { useState, useEffect } from 'react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState<string | undefined>();
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
      setThumbnails(images.slice(1));
    }
  }, [images]);

  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
    setThumbnails(prev => [
      ...prev.filter(img => img !== image),
      ...(mainImage && mainImage !== image ? [mainImage] : [])
    ]);
  };

  return (
    <div className="flex" style={{ height: 'clamp(300px, 85vh, 85vh)', alignItems: 'flex-start' }}>
      <div className="mr-6" style={{ height: '100%' }}>
        {mainImage && (
          <img
            src={mainImage}
            alt="Main"
            className="h-full w-full object-contain"  // Ensures the image scales properly within the container
            style={{ maxHeight: '100%', objectFit: 'contain' }}
          />
        )}
      </div>
      {thumbnails.length > 0 && (
      <div className=" w-1/4 flex flex-col overflow-y-auto" style={{ maxHeight: '100%', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {thumbnails.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="cursor-pointer mb-2 w-full h-auto object-cover"
            onClick={() => handleThumbnailClick(image)}
            style={{ marginBottom: '5px' }}
          />
        ))}
        {/* Style to hide scrollbar but allow scrolling */}
        <style>
          {`.scrollbar-hidden::-webkit-scrollbar { display: none; }`}
        </style>
      </div>
      )}
    </div>
  );
};

export default ImageGallery;
