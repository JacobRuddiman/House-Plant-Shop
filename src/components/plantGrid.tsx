'use client';

import React, { useEffect, useState } from "react";
import PlantCard from "./plantCard";
import { getPlants } from "@/server/plants";
import { useSearchParams } from "next/navigation";

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
  rating: number;
  imageUrl: string;
  images: { id: number; url: string; plantId: number | null }[];
}

const PlantGrid = () => {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') as 'scientificName' | 'price' | 'rating' || 'scientificName';
  const order = searchParams.get('order') as 'asc' | 'desc' || 'asc';
  const genus = searchParams.get('genus') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '');



  const [plants, setPlants] = useState<Plant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchPlants = async () => {
      const { plants, error } = await getPlants({ sort, order, genus, minPrice, maxPrice });

      if (error) {
        console.error("Error fetching plants:", error);
        setError(error);
      } else if (plants) {
        console.log("CLIENT GETPLANTS IN GRID:", plants)
        setPlants(plants);
      }
    };

    fetchPlants();
  }, [sort, order, genus, minPrice, maxPrice]);

  if (error) {
    return <div>Error fetching plants: {error}</div>;
  }

  if (!plants || plants.length === 0) {
    return <div>No plants available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex">

        <div >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {plants.map((plant: Plant) => (
              <PlantCard key={plant.id} {...plant} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantGrid;
