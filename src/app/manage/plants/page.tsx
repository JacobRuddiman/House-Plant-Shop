import React from 'react';
import ManagePlantsForm from '@/components/managePlants.Form';

const ManagePlantsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Plants</h1>
      <ManagePlantsForm />
    </div>
  );
};

export default ManagePlantsPage;
