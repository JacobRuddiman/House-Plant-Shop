"use server";

import { chownSync } from 'fs';
import prisma from '../lib/prisma';

interface CreatePlantInput {
  scientificName: string;
  commonName: string;
  genus: string;
  species: string;
  description: string;
  price: number;
  discountPrice: number;
  count: number;
  imageIds: number[]; // Update to use imageIds
  rating: number;
}

interface GetPlantsInput {
  sort?: 'scientificName' | 'price' | 'rating';
  order?: 'asc' | 'desc';
  genus?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function getPlants(params: GetPlantsInput = {}) {
  try {
    const { sort = 'scientificName', order = 'asc', genus, minPrice, maxPrice } = params;
    const query: any = {};

    

    // Filter by genus if provided
    if (genus) {
      query.genus = genus;
    }

    // Filter by price range if provided and ensure values are valid numbers
    if (typeof minPrice === 'number' && !isNaN(minPrice) && typeof maxPrice === 'number' && !isNaN(maxPrice)) {
      query.price = { gte: minPrice, lte: maxPrice };
    } else if (typeof minPrice === 'number' && !isNaN(minPrice)) {
      query.price = { gte: minPrice };
    } else if (typeof maxPrice === 'number' && !isNaN(maxPrice)) {
      query.price = { lte: maxPrice };
    }

    // Define the orderBy parameter based on the provided sort and order
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (sort) {
      orderBy[sort] = order;
    }


    const plants = await prisma.plant.findMany({
      where: query,
      orderBy,
      include: {
        images: true, // Include related images
      },
    });

    // Map the plants to include a primary image URL
    const plantsWithImageUrl = plants.map(plant => ({
      ...plant,
      imageUrl: plant.images.length > 0 ? plant.images[0].url : '', // Get the first image URL or empty string if no images
    }));

    return { plants: plantsWithImageUrl };
  } catch (error) {
    console.error("Error fetching plants:", error);
    return { error: 'Failed to fetch plants' };
  }
}

export async function createPlant(data: CreatePlantInput) {
  try {
    // Ensure rating is within 0 to 5 range
    const adjustedRating = Math.min(Math.max(data.rating, 0), 5);

    const newPlant = await prisma.plant.create({
      data: {
        scientificName: data.scientificName,
        commonName: data.commonName,
        genus: data.genus,
        species: data.species,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        count: data.count,
        rating: adjustedRating,  // Use the adjusted rating
        images: {
          connect: data.imageIds.map(id => ({ id })),
        },
      },
    });
    return { newPlant };
  } catch (error) {
    console.error("Error creating plant:", error);
    return { error: 'Failed to create plant' };
  }
}

export async function deletePlant(id: number) {
  try {
    await prisma.plant.delete({
      where: { id },
    });
    return { message: 'Plant deleted successfully' };
  } catch (error) {
    console.error("Error deleting plant:", error);
    return { error: 'Failed to delete plant' };
  }
}

export async function getGenuses() {
  console.log("Server: Calling getGenuses");
  try {
    const genuses = await prisma.plant.findMany({
      distinct: ['genus'],
      select: { genus: true },
    });
    const genusNames = genuses.map(plant => plant.genus).sort();
    return { genuses: genusNames };
  } catch (error) {
    console.error("Server: Error fetching genuses:", error);
    return { error: 'Failed to fetch genuses' };
  }
}


export async function getPlant(id: number) {
  const plant = await prisma.plant.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          id: 'asc'
        }
      }
    },
  });

  if (!plant) {
    throw new Error('Plant not found');
  }

  return plant;
}



export async function getRelatedPlants(genus: string, price: number, maxRelatedPlants = 6) {
  try {
    console.log(`Fetching related plants for genus: ${genus}, price: ${price}`);

    // Fetch plants of the same genus sorted by price proximity, including images
    const relatedPlantsByGenus = await prisma.plant.findMany({
      where: {
        genus,
        price: {
          gte: price * 0.8, // within 80% of the current plant's price
          lte: price * 1.2, // within 120% of the current plant's price
        },
      },
      orderBy: {
        price: 'asc',
      },
      include: {
        images: true, // Include related images
      },
      take: maxRelatedPlants,
    });

    console.log(`Related plants by genus found: ${relatedPlantsByGenus.length}`);

    let allRelatedPlants = [...relatedPlantsByGenus];

    // If we have fewer than the required number of related plants, fetch additional plants
    if (relatedPlantsByGenus.length < maxRelatedPlants) {
      console.log(`Fetching additional plants because only ${relatedPlantsByGenus.length} plants were found`);

      const additionalPlants = await prisma.plant.findMany({
        where: {
          genus: {
            not: genus, // Exclude the same genus to get diverse options
          },
          price: {
            gte: price * 0.8,
            lte: price * 1.2,
          },
          id: {
            notIn: relatedPlantsByGenus.map((plant) => plant.id), // Avoid duplicates
          },
        },
        orderBy: {
          price: 'asc',
        },
        include: {
          images: true, // Include related images
        },
        take: maxRelatedPlants - relatedPlantsByGenus.length,
      });

      console.log(`Additional plants found: ${additionalPlants.length}`);

      // Combine both lists
      allRelatedPlants = [...allRelatedPlants, ...additionalPlants];
    }

    // If we still have fewer than the max, fetch random plants to fill up the remaining spots
    if (allRelatedPlants.length < maxRelatedPlants) {
      const randomPlants = await prisma.plant.findMany({
        where: {
          id: {
            notIn: allRelatedPlants.map((plant) => plant.id), // Avoid duplicates
          },
        },
        include: {
          images: true, // Include related images
        },
        take: maxRelatedPlants - allRelatedPlants.length,
      });

      console.log(`Random plants found: ${randomPlants.length}`);
      allRelatedPlants = [...allRelatedPlants, ...randomPlants];
    }

    // Shuffle the combined list
    const shuffledPlants = shuffleArray(allRelatedPlants);
    console.log(`Returning ${shuffledPlants.length} plants after shuffling`);
    console.log("SERVER:", allRelatedPlants);

    return shuffledPlants;
  } catch (error) {
    console.error("Error fetching related plants:", error);
    return [];
  }
}


// Utility function to shuffle an array
function shuffleArray(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}
