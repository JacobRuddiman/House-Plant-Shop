// /app/shop/page.tsx

'use client';

import React, { Suspense } from 'react';
import FilterBar from '@/components/filterBar';
import SortBar from '@/components/sortBar';
import PlantGrid from '@/components/plantGrid';

const ShopPage: React.FC = () => {
  return (
    <div className="container flex">
      <div className="w-1/6 mr-4 bg-secondary h-screen">
        <Suspense fallback={<div>Loading filters...</div>}>
          <FilterBar />
        </Suspense>
      </div>
      <div className="w-full">
        <Suspense fallback={<div>Loading sorting and plant data...</div>}>
          <SortBar />
          <PlantGrid />
        </Suspense>
      </div>
    </div>
  );
};

export default ShopPage;
