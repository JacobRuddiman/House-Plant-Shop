"use client";
import React, { useEffect, useState } from 'react';
import PlantCard from './plantCard';
import { getPlants } from '../server/plants';

interface Plant {
  id: number;
  scientificName: string;
  commonName: string;
  genus: string;
  species: string;
  description: string;
  price: number;
  discountPrice: number;
  count: number;
  imageUrl: string;
  isDiscounted: boolean; // Ensure isDiscounted is part of the Plant interface
}

const PromotedPlants: React.FC = () => {
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlants() {
      const result = await getPlants();
      if (result.error) {
        setError(result.error);
      } else if (result.plants) {
        const shuffled = result.plants.sort(() => 0.5 - Math.random());
        setSelectedPlants(shuffled.slice(0, 6));
      }
    }
    fetchPlants();
  }, []);

  const plantsToShow = [...selectedPlants, ...selectedPlants, ...selectedPlants, ...selectedPlants]; // Duplicate the plant list

  return (
    <div className="overflow-hidden mb-8 p-4">
      <h2 className="text-2xl font-bold mb-4"></h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="relative w-full">
          <div className="flex w-max animate-scroll">
            {plantsToShow.map((plant, index) => (
              <div key={index} className="flex-shrink-0 w-60 mx-2">
                <PlantCard rating={0} {...plant} isDiscounted={plant.isDiscounted} />
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r -ml-4 from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l -mr-4 from-white to-transparent pointer-events-none"></div>
        </div>
      )}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PromotedPlants;
