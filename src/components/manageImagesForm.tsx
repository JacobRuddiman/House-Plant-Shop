'use client';

import React, { useState } from 'react';

import { createImage } from '@/server/images';

const ManageImagesForm: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('filename', imageFile.name)
    console.log("Here");
    const response = await createImage(formData);

    console.log(response)
  };
  
  

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload Image File</span>
          </label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <button type="submit" className="btn btn-primary">Add Image</button>
        </div>
      </form>
    </div>
  );
};

export default ManageImagesForm;
