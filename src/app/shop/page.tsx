'use client';

import React from 'react';
import FilterBar from '@/components/filterBar';
import SortBar from '@/components/sortBar';
import PlantGrid from '@/components/plantGrid';

const ShopPage: React.FC = () => {
  return (
    <div className="container flex">
      <div className="w-1/6 mr-4 bg-secondary h-screen">
        <FilterBar />
      </div>
      <div className="w-full">
        <SortBar />
        <PlantGrid />
      </div>
    </div>
  );
};

export default ShopPage;
