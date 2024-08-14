'use client';

import React, { useState, useEffect } from 'react';
import { getPlants } from '@/server/plants';

interface PlantSelectorProps {
  onSelect: (plantId: number) => void;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({ onSelect }) => {
  const [plants, setPlants] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlants = async () => {
      const result = await getPlants();
      if (result.plants) {
        setPlants(result.plants);
      } else {
        setPlants([]);
      }
    };

    fetchPlants();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select Plant</h2>
      <ul className="menu menu-vertical bg-base-200 rounded-box">
        {plants.map((plant) => (
          <li key={plant.id}>
            <button className="btn btn-link" onClick={() => onSelect(plant.id)}>
              {plant.scientificName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlantSelector;
