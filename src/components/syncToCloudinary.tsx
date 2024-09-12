'use client';

import React, { useState } from 'react';
import { syncDatabaseWithCloudinary } from '@/server/images';

const SyncToCloudinary: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncStatus('Syncing...');
    try {
      const response = await syncDatabaseWithCloudinary();
  
      // Check if the response contains an error property
      if ('error' in response) {
        setSyncStatus(`Error: ${response.error}`);
      } else {
        setSyncStatus(response.message);
      }
    } catch (error) {
      console.error('Error syncing database with Cloudinary:', error);
      setSyncStatus('Error syncing database with Cloudinary');
    }
  };
  

  return (
    <div className="space-y-4">
      <button onClick={handleSync} className="btn btn-primary">
        Sync Database with Cloudinary
      </button>
      {syncStatus && <div className="mt-4 text-sm">{syncStatus}</div>}
    </div>
  );
};

export default SyncToCloudinary;
