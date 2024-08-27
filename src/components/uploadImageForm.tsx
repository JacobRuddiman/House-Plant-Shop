'use client';

import React, { useState, useRef } from 'react';

const UploadImageForm: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadLocal = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    const formData = new FormData();
    formData.append('image', fileInputRef.current.files[0]);

    try {
      const response = await fetch('/api/upload/local', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(`Image uploaded: ${data.url}`);
      }
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  const handleUploadUrl = async () => {
    try {
      const response = await fetch('/api/upload/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(`Image uploaded: ${data.url}`);
      }
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <div>
        <input type="file" ref={fileInputRef} />
        <button onClick={handleUploadLocal}>Upload Local Image</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button onClick={handleUploadUrl}>Upload Image from URL</button>
      </div>
    </div>
  );
};

export default UploadImageForm;
