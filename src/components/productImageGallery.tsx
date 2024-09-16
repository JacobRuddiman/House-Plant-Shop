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
    setThumbnails((prev) => [
      ...prev.filter((img) => img !== image),
      ...(mainImage && mainImage !== image ? [mainImage] : []),
    ]);
  };

  return (
    <div className="flex" style={{ alignItems: 'flex-start' }}>
      {/* Main image */}
      <div className={`${thumbnails.length > 0 ? 'mr-2' : ''} w-3/4 h-auto`}>
        {mainImage && (
          <img
            src={mainImage}
            alt="Main"
            className="w-full h-auto object-contain" // Ensure the image maintains aspect ratio
          />
        )}
      </div>

      {/* Thumbnails */}
      {thumbnails.length > 0 && (
        <div
          className="flex flex-col justify-start w-1/4 h-auto overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {thumbnails.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="cursor-pointer mb-2 w-full h-auto object-cover"
              onClick={() => handleThumbnailClick(image)}
              style={{ maxHeight: '20%', marginBottom: '5px' }} // Adjust thumbnail size
            />
          ))}

          {/* Hide scrollbar but allow scrolling */}
          <style>{`.scrollbar-hidden::-webkit-scrollbar { display: none; }`}</style>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
