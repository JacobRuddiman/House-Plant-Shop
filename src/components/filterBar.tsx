"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getGenuses } from '@/server/plants';

const FilterBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialGenus = searchParams.get('genus') || 'All';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  const [genus, setGenus] = useState(initialGenus);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [genuses, setGenuses] = useState<string[]>([]);

  useEffect(() => {
    async function fetchGenuses() {
      console.log("Fetching genuses...");
      try {
        console.log("Genus fetch attemt")
        const response = await getGenuses();
        console.log("Genuses fetched:", response);  
        if (response.genuses) {
          console.log("Updating state with genuses:", response.genuses);
          setGenuses(['All', ...response.genuses]);
        } else {
          console.error("No genuses in response", response);
        }
      } catch (error) {
        console.error("Failed to fetch genuses:", error);
      }
    }
    
    
    fetchGenuses();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (genus !== 'All') {
      params.set('genus', genus);
    } else {
      params.delete('genus');
    }
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }
    router.push(`/shop?${params.toString()}`);
  }, [genus, minPrice, maxPrice]);

  return (
    <div className="flex flex-col space-y-4 my-8 px-4">
      <div>
        <label className="block mb-2">Genus:</label>
        <select
          value={genus}
          onChange={(e) => setGenus(e.target.value)}
          className="input input-bordered w-full h-8"
        >
          {genuses.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2">Price Range:</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input input-bordered w-full h-8"
            placeholder="Min"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input input-bordered w-full h-8"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
