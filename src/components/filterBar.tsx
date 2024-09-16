"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getGenuses, getCategories } from '@/server/plants'; // Import getCategories and getGenuses

const FilterBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialFilters = (): { [key: string]: string } => ({
    genus: searchParams.get('genus') || 'All',
    category: searchParams.get('category') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    isDiscounted: searchParams.get('isDiscounted') || '', 
  });

  const [filters, setFilters] = useState<{ [key: string]: string }>(getInitialFilters());
  const [genuses, setGenuses] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGenusesAndCategories = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      // Fetch Genuses
      const genusesResponse = await getGenuses();
      const fetchedGenuses = genusesResponse.genuses || [];
      setGenuses(['All', ...fetchedGenuses]);
  
      // Fetch Categories
      const categoriesResponse = await getCategories();
      const fetchedCategories = categoriesResponse.categories || [];
      setCategories(['All', ...fetchedCategories]);
    } catch (error) {
      console.error("Failed to fetch genuses or categories:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, []);

  

  useEffect(() => {
    fetchGenusesAndCategories(); // Fetch both genuses and categories when the component mounts
  }, [fetchGenusesAndCategories]);

  useEffect(() => {
    setFilters(getInitialFilters()); // Update filters when searchParams change
  }, [searchParams]);

  const updateURL = useCallback((newFilters: { [key: string]: string }) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'All') {
        params.set(key, value);
      }
    });
    router.push(`/shop?${params.toString()}`);
  }, [router]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked ? 'true' : '' : event.target.value;
    setFilters(prev => ({ ...prev, [field]: newValue }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      updateURL(filters); 
    }
  };

  const handleUpdateClick = () => {
    updateURL(filters);
  };

  if (loading) {
    return <div>Loading filters...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 my-8 px-4">
      {/* Genus Filter */}
      <div>
        <label className="block mb-2">Genus:</label>
        <select
          value={filters.genus}
          onChange={(e) => handleChange('genus')(e)}
          className="input input-bordered w-full h-8"
        >
          {genuses.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block mb-2">Category:</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category')(e)}
          className="input input-bordered w-full h-8"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Price Filter */}
      <div>
        <label className="block mb-2">Price Range:</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice')(e)}
            className="input input-bordered w-full h-8"
            placeholder="Min"
            onKeyPress={handleKeyPress}
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice')(e)}
            className="input input-bordered w-full h-8"
            placeholder="Max"
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      {/* Discounted Filter */}
      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isDiscounted === 'true'}
            onChange={(e) => handleChange('isDiscounted')(e)}
            className="toggle toggle-success"
          />
          <span className="ml-2">Discounted Plants</span>
        </div>
      </div>

      <button
        onClick={handleUpdateClick}
        className="btn mt-4"
      >
        Update
      </button>
    </div>
  );
};

export default FilterBar;
