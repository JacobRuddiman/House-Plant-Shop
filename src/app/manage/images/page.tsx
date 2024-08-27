import React from 'react';
import ManageImagesForm from '@/components/manageImagesForm';

const ManageImagesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Images</h1>
      <ManageImagesForm />
    </div>
  );
};

export default ManageImagesPage;
