import React from 'react';
import PlantGrid from '@/components/plantGrid';
import PromotedPlants from '@/components/promotedPlant';
import Promotion from '@/components/promotion-banner';

export default function HomePage() {
  return (
    <div className='flex justify-center'>
      <div className='w-4/5'>
        <div className="pt-4">
          <div className="text-5xl">Promoted</div>
          <PromotedPlants />
        </div>
        <div>
          <Promotion/>
        </div>
      </div>
    </div>
  );
}
