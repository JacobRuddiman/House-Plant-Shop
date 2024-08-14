'use client';

import React, { useState } from 'react';
import { createPlant } from '../server/plants';
import { updateImagePlantId } from '../server/images';
import AppendImageToPlant from './appendImageToPlant';
import { useRouter } from 'next/router';

const ManagePlantsForm: React.FC = () => {
  const [plantData, setPlantData] = useState({
    scientificName: '',
    commonName: '',
    genus: '',
    species: '',
    description: '',
    price: 0,
    discountPrice: 0,
    count: 0,
    rating: 0,
    imageIds: [] as number[], // New field for holding image IDs
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlantData({
      ...plantData,
      [name]: name === 'price' || name === 'discountPrice' || name === 'count' ? parseFloat(value) : value,
    });
  };

  const handleImageIdChange = (index: number, value: number) => {
    const newImageIds = [...plantData.imageIds];
    newImageIds[index] = value;
    setPlantData({ ...plantData, imageIds: newImageIds });
  };

  const addImageIdField = () => {
    setPlantData({ ...plantData, imageIds: [...plantData.imageIds, 0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createPlant(plantData);
    if ('error' in result) {
      alert(result.error);
    } else {
      alert('Plant created successfully');

      // Update images with the new plant ID
      for (const imageId of plantData.imageIds) {
        await updateImagePlantId({ imageId, plantId: result.newPlant.id });
      }

      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Scientific Name</span>
          </label>
          <input
            type="text"
            name="scientificName"
            value={plantData.scientificName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Common Name</span>
          </label>
          <input
            type="text"
            name="commonName"
            value={plantData.commonName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Genus</span>
          </label>
          <input
            type="text"
            name="genus"
            value={plantData.genus}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Species</span>
          </label>
          <input
            type="text"
            name="species"
            value={plantData.species}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={plantData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <input
            type="number"
            name="price"
            value={plantData.price}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Discount Price</span>
          </label>
          <input
            type="number"
            name="discountPrice"
            value={plantData.discountPrice}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Count</span>
          </label>
          <input
            type="number"
            name="count"
            value={plantData.count}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Rating</span>
          </label>
          <input
            type="number"
            name="rating"
            value={plantData.rating}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          {plantData.imageIds.map((id, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="number"
                value={id}
                onChange={(e) => handleImageIdChange(index, parseInt(e.target.value))}
                className="input input-bordered w-full"
              />
              {index === plantData.imageIds.length - 1 && (
                <button type="button" onClick={addImageIdField} className="btn btn-primary">
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="form-control">
          <button type="submit" className="btn btn-primary">Add Plant</button>
        </div>
      </form>
      <div>
        <AppendImageToPlant/>
      </div>
    </div>
  );
};

export default ManagePlantsForm;
