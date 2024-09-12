import React from 'react';
import ManagePlantCategories from '@/components/managePlantCategories';

const ManagePlantsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <ManagePlantCategories />
    </div>
  );
};

export default ManagePlantsPage;
