import React from 'react';
import ManageImagesForm from '@/components/manageImagesForm';
import SyncToCloudinary from '@/components/syncToCloudinary';

const ManageImagesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Images</h1>
      <ManageImagesForm />
      <div className = "my-8">
        <SyncToCloudinary />
      </div>
    </div>
  );
};

export default ManageImagesPage;
