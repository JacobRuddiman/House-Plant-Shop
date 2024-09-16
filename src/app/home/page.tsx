import React from 'react';
import PlantGrid from '@/components/plantGrid';
import PromotedPlants from '@/components/promotedPlant';
import Promotion from '@/components/promotion-banner';
import CategoryGrid from '@/components/categoryGrid';  // Import the new CategoryGrid component

export default function HomePage() {
  return (
    <div className='flex justify-center'>
      <div className='w-4/5'>
        <div className="pt-4">
          <div className="text-5xl">Promoted</div>
          <PromotedPlants />
        </div>
        <div className="pt-4">
          <div className="text-5xl mb-4">Categories</div>
          <CategoryGrid />  {/* Add the CategoryGrid here */}
        </div>
        <div>
          <Promotion />
        </div>
      </div>
    </div>
  );
}
