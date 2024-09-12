'use client';

import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../server/categories';
import { useRouter } from 'next/navigation';
import { Category } from '@/lib/types';

const ManagePlantCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState({ id: 0, name: '' });
  const [isEditing, setIsEditing] = useState(false);  // Track if we are editing
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getCategories();
      
      if ('error' in result) {
        console.error(result.error);
      } else {
        setCategories(result);  // Safely set categories if no error
      }
    };
    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      await updateCategory(categoryData.id, { name: categoryData.name });
      alert('Category updated successfully');
    } else {
      await createCategory({ name: categoryData.name });
      alert('Category created successfully');
    }

    const updatedCategories = await getCategories();
    if (!('error' in updatedCategories)) {
      setCategories(updatedCategories as Category[]);  // Safely update state
    } else {
      console.error(updatedCategories.error);  // Handle the error
    }
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setCategoryData(category);
    setIsEditing(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId);
      alert('Category deleted successfully');

      const updatedCategories = await getCategories();
      if (!('error' in updatedCategories)) {
        setCategories(updatedCategories as Category[]);  // Safely update state
      } else {
        console.error(updatedCategories.error);  // Handle the error
      }
    }
  };

  const resetForm = () => {
    setCategoryData({ id: 0, name: '' });
    setIsEditing(false);  // Stop editing mode
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="form-control flex space-x-2">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Category' : 'Add Category'}
          </button>

          {/* Cancel Edit Button (only visible during editing) */}
          {isEditing && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Existing Categories List */}
      <div>
        <h3 className="text-lg font-bold mb-4">Existing Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="flex justify-between mb-2">
              <span>{category.name}</span>
              <div>
                {/* Disable edit/delete while editing another category */}
                {!isEditing && (
                  <>
                    <button onClick={() => handleEdit(category)} className="btn btn-secondary mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="btn btn-error">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagePlantCategories;
