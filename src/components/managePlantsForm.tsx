'use client';

import React, { useState, useEffect } from 'react';
import { createPlant } from '../server/plants';
import { updateImagePlantId } from '../server/images';
import { getCategories } from '../server/categories'; 
import AppendImageToPlant from './appendImageToPlant';
import { useRouter } from 'next/navigation';
import { Category } from '@/lib/types';  // Keep using shared types for categories

// Define local type for plant data specific to this form
interface PlantFormData {
  scientificName: string;
  commonName: string;
  genus: string;
  species: string;
  description: string;
  price: number;
  discountPrice: number;
  isDiscounted: boolean;
  count: number;
  rating: number;
  imageIds: number[];  // Local field for image IDs
  categoryId: number | null;  // Category relation
}

const ManagePlantsForm: React.FC = () => {
  const [plantData, setPlantData] = useState<PlantFormData>({
    scientificName: '',
    commonName: '',
    genus: '',
    species: '',
    description: '',
    price: 0,
    discountPrice: 0,
    isDiscounted: false,
    count: 0,
    rating: 0,
    imageIds: [],  // Track image IDs separately
    categoryId: null,
  });

  const [categories, setCategories] = useState<Category[]>([]);  
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getCategories();
      if (!('error' in result)) {
        setCategories(result); 
      } else {
        console.error(result.error);  
      }
    };
    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement; 
      setPlantData({
        ...plantData,
        [name]: checked,
      });
    } else {
      setPlantData({
        ...plantData,
        [name]: name === 'price' || name === 'discountPrice' || name === 'count' ? parseFloat(value) : value,
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value);
    setPlantData({ ...plantData, categoryId: categoryId || null });
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
      for (const imageId of plantData.imageIds) {
        await updateImagePlantId({ imageId, plantId: result.newPlant.id });
      }
      router.refresh();
    }
  };

  const toggleIsDiscounted = () => {
    setPlantData(prevState => ({
      ...prevState,
      isDiscounted: !prevState.isDiscounted,
    }));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scientific Name */}
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

        {/* Common Name */}
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

        {/* Genus */}
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

        {/* Species */}
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

        {/* Description */}
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

        {/* Price */}
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

        {/* Discount Price */}
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

        {/* Is Discounted Toggle Button */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Is Discounted?</span>
          </label>
          <button
            type="button"
            onClick={toggleIsDiscounted}
            className={`btn ${plantData.isDiscounted ? 'btn-success' : 'btn-error'}`}
          >
            {plantData.isDiscounted ? 'Discounted' : 'Not Discounted'}
          </button>
        </div>

        {/* Count */}
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

        {/* Rating */}
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

        {/* Category Dropdown */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            name="categoryId"
            value={plantData.categoryId ?? ''}
            onChange={handleCategoryChange}
            className="select select-bordered w-full"
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
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
                  Add Image ID
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="form-control">
          <button type="submit" className="btn btn-primary">Add Plant</button>
        </div>
      </form>
    </div>
  );
};

export default ManagePlantsForm;
