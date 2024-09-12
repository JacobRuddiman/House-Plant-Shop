"use client";

import React, { useState, useEffect } from 'react';
import { getPlants, updatePlant, deletePlant } from '../server/plants'; // Import deletePlant function
import { PlantData, Category } from '@/lib/types';

interface PlantTableProps {
  categories: Category[];
}

const PlantTable: React.FC<PlantTableProps> = ({ categories }) => {
  const [plants, setPlants] = useState<PlantData[]>([]);
  const [editingPlant, setEditingPlant] = useState<PlantData | null>(null);

  useEffect(() => {
    const loadPlants = async () => {
      const result = await getPlants();
      if (!('error' in result)) {
        setPlants(result.plants);
      } else {
        console.error(result.error);
      }
    };
    loadPlants();
  }, []);

  const handleEditClick = (plant: PlantData) => {
    setEditingPlant(plant); // Populate form with selected plant data
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingPlant) {
      const { name, value, type } = e.target;
      setEditingPlant({
        ...editingPlant,
        [name]:
          type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : name === 'price' || name === 'discountPrice' || name === 'count'
            ? parseFloat(value)
            : value,
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editingPlant) {
      setEditingPlant({
        ...editingPlant,
        categoryId: parseInt(e.target.value) || null,
      });
    }
  };

  const handleSave = async () => {
    if (editingPlant) {
      const result = await updatePlant(editingPlant);
      if ('error' in result) {
        alert(result.error);
      } else {
        alert('Plant updated successfully');
        setEditingPlant(null);
        const updatedPlants = await getPlants();
        setPlants(updatedPlants.plants);
      }
    }
  };

  const handleCancel = () => {
    setEditingPlant(null);
  };

  const handleDelete = async (plantId: number) => {
    if (confirm('Are you sure you want to delete this plant?')) {
      const result = await deletePlant(plantId);
      if ('error' in result) {
        alert(result.error);
      } else {
        alert('Plant deleted successfully');
        const updatedPlants = await getPlants();
        setPlants(updatedPlants.plants); // Refresh the plant list after deletion
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Plants</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th>Scientific Name</th>
            <th>Common Name</th>
            <th>Price</th>
            <th>Discount Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((plant) => (
            <tr key={plant.id}>
              <td>{plant.scientificName}</td>
              <td>{plant.commonName}</td>
              <td>{plant.price}</td>
              <td>{plant.discountPrice}</td>
              <td>{categories.find((cat) => cat.id === plant.categoryId)?.name || 'Uncategorized'}</td>
              <td>
                <button onClick={() => handleEditClick(plant)} className="btn btn-primary mx-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(plant.id)} className="btn btn-error">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPlant && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Edit Plant</h3>
          <form>
            <div className="form-control">
              <label className="label">Scientific Name</label>
              <input
                type="text"
                name="scientificName"
                value={editingPlant.scientificName}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Common Name</label>
              <input
                type="text"
                name="commonName"
                value={editingPlant.commonName}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Genus</label>
              <input
                type="text"
                name="genus"
                value={editingPlant.genus}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Species</label>
              <input
                type="text"
                name="species"
                value={editingPlant.species}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Price</label>
              <input
                type="number"
                name="price"
                value={editingPlant.price}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Discount Price</label>
              <input
                type="number"
                name="discountPrice"
                value={editingPlant.discountPrice}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Stock Count</label>
              <input
                type="number"
                name="count"
                value={editingPlant.count}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">Is Discounted?</label>
              <input
                type="checkbox"
                name="isDiscounted"
                checked={editingPlant.isDiscounted}
                onChange={handleInputChange}
                className="toggle toggle-success"
              />
            </div>
            <div className="form-control">
              <label className="label">Category</label>
              <select
                name="categoryId"
                value={editingPlant.categoryId ?? ''}
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
            <div className="flex justify-between mt-4">
              <button type="button" onClick={handleSave} className="btn btn-success">
                Save
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-error">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlantTable;
