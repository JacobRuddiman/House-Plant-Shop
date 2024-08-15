import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getGenuses } from '@/server/plants';
import { debounce } from 'lodash';

const FilterBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialFilters = () => ({
    genus: searchParams.get('genus') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const [filters, setFilters] = useState<{ [key: string]: string }>(getInitialFilters());
  const [genuses, setGenuses] = useState<string[]>(['All']);

  const fetchGenuses = useCallback(async () => {
    console.log("Fetching genuses...");
    try {
      const response = await getGenuses();
      const fetchedGenuses = response.genuses || [];
      console.log("Genuses fetched:", fetchedGenuses);
      setGenuses(['All', ...fetchedGenuses]);
    } catch (error) {
      console.error("Failed to fetch genuses:", error);
      setGenuses(['All']);
    }
  }, []);

  useEffect(() => {
    fetchGenuses();
  }, [searchParams]); // Fetch on mount

  useEffect(() => {
    setFilters(getInitialFilters()); // Update filters when searchParams change
  }, [searchParams]);

  const updateURL = useCallback((newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'All') {
        params.set(key, value);
      }
    });
    router.push(`/shop?${params.toString()}`);
    console.log("CLIENT Updating URL");
  }, [router]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = event.target.value;
    setFilters(prev => {
      const newFilters = { ...prev, [field]: newValue };
      if (field === 'genus') {
        updateURL(newFilters); // Update URL immediately with new filters
      }
      return newFilters;
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      updateURL(filters); // Only update URL on Enter for price inputs
    }
  };

  return (
    <div className="flex flex-col space-y-4 my-8 px-4">
      <div>
        <label className="block mb-2">Genus:</label>
        <select
          value={filters.genus}
          onChange={handleChange('genus')}
          className="input input-bordered w-full h-8"
        >
          {genuses.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2">Price Range:</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={handleChange('minPrice')}
            className="input input-bordered w-full h-8"
            placeholder="Min"
            onKeyPress={handleKeyPress}
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={handleChange('maxPrice')}
            className="input input-bordered w-full h-8"
            placeholder="Max"
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
