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
  isDiscounted: boolean;
}

const PlantGrid = () => {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') as 'scientificName' | 'price' | 'rating' || 'scientificName';
  const order = searchParams.get('order') as 'asc' | 'desc' || 'asc';
  const genus = searchParams.get('genus') || '';
  const category = searchParams.get('category') || ''; // Get the category filter
  const minPrice = parseFloat(searchParams.get('minPrice') || '');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '');
  const isDiscounted = searchParams.get('isDiscounted') === 'true';
  const search = searchParams.get('search') || ''; // Capture the search term

  const [plants, setPlants] = useState<Plant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      const { plants, error } = await getPlants({
        sort,
        order,
        genus,
        category, // Add the category filter when fetching plants
        minPrice,
        maxPrice,
        isDiscounted,
        search,
      });

      if (error) {
        console.error("Error fetching plants:", error);
        setError(error);
      } else if (plants) {
        setPlants(plants);
      }
    };

    fetchPlants();
  }, [sort, order, genus, category, minPrice, maxPrice, isDiscounted, search]); // Include category in the dependency array

  if (error) {
    return <div>Error fetching plants: {error}</div>;
  }

  if (!plants || plants.length === 0) {
    return <div>No plants available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {plants.map((plant: Plant) => (
          <PlantCard key={plant.id} {...plant} isDiscounted={plant.isDiscounted} />
        ))}
      </div>
    </div>
  );
};

export default PlantGrid;
