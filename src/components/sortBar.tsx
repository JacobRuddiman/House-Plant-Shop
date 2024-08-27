'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SortBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialSort = searchParams.get('sort') || 'scientificName';
  const initialOrder = searchParams.get('order') || 'asc';

  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);
    router.push(`/shop?${params.toString()}`);
  }, [sort, order]);

  const handleSortChange = (newSort: string) => {
    if (sort === newSort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(newSort);
      setOrder('asc');
    }
  };

  return (
    <div className="my-4 p-2">
      <div className="flex space-x-4">
        <button
          className={`btn ${sort === 'scientificName' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSortChange('scientificName')}
        >
          Scientific Name {sort === 'scientificName' && (order === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`btn ${sort === 'price' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSortChange('price')}
        >
          Price {sort === 'price' && (order === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`btn ${sort === 'rating' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSortChange('rating')}
        >
          Rating {sort === 'rating' && (order === 'asc' ? '↑' : '↓')}
        </button>
      </div>
    </div>
  );
};

export default SortBar;
