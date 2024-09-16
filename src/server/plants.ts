"use server";

import prisma from '../lib/prisma';
import { PlantData } from '@/lib/types';

interface CreatePlantInput {
  scientificName: string;
  commonName: string;
  genus: string;
  species: string;
  description: string;
  price: number;
  discountPrice: number;
  count: number;
  imageIds: number[]; 
  rating: number;
  categoryId: number; // New field for category
}

interface UpdatePlantInput {
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
  categoryId: number;
}

interface GetPlantsInput {
  sort?: 'scientificName' | 'price' | 'rating';
  order?: 'asc' | 'desc';
  genus?: string;
  category?: string;  // Add category filter
  minPrice?: number;
  maxPrice?: number;
  isDiscounted?: boolean;
  search?: string;  // Add search term filter
}


export async function updatePlant(data: PlantData) {
  try {
    const updatedPlant = await prisma.plant.update({
      where: { id: data.id },
      data: {
        scientificName: data.scientificName,
        commonName: data.commonName,
        genus: data.genus,
        species: data.species,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        count: data.count,
        rating: Math.min(Math.max(data.rating, 0), 5),  // Adjust rating between 0 and 5
        isDiscounted: data.isDiscounted,
        category: {
          connect: { id: data.categoryId ?? undefined },
        },
      },
    });

    return { updatedPlant };
  } catch (error) {
    console.error('Error updating plant:', error);
    return { error: 'Failed to update plant' };
  }
}


export async function getPlants(params: GetPlantsInput = {}) {
  try {
    const { sort = 'scientificName', order = 'asc', genus, category, minPrice, maxPrice, isDiscounted, search } = params;
    const query: any = {};

    if (genus) {
      query.genus = genus;
    }

    if (category) {
      query.category = {
        name: category, // Ensure you're filtering by the category name
      };
    }

    if (typeof minPrice === 'number' && !isNaN(minPrice)) {
      query.price = { gte: minPrice };
    }

    if (typeof maxPrice === 'number' && !isNaN(maxPrice)) {
      query.price = query.price ? { ...query.price, lte: maxPrice } : { lte: maxPrice };
    }

    if (isDiscounted) {
      query.isDiscounted = true;
    }

    if (search) {
      query.OR = [
        { scientificName: { contains: search, mode: 'insensitive' } },
        { commonName: { contains: search, mode: 'insensitive' } },
        { genus: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (sort) {
      orderBy[sort] = order;
    }

    const plants = await prisma.plant.findMany({
      where: query,
      orderBy,
      include: {
        images: true,
        category: true, // Ensure the category is included
      },
    });

    const plantsWithImageUrl: PlantData[] = plants.map((plant) => ({
      ...plant,
      price: plant.price.toNumber(), // Convert Decimal to number
      discountPrice: plant.discountPrice.toNumber(), // Convert Decimal to number
      imageUrl: plant.images.length > 0 ? plant.images[0].url : '', // Get first image URL or empty string
    }));

    return { plants: plantsWithImageUrl };
  } catch (error) {
    console.error('Error fetching plants:', error);
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
        category: {
          connect: { id: data.categoryId }, // Connect the plant to a category
        },
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



export async function getPlant(id: number) {
  const plant = await prisma.plant.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!plant) {
    throw new Error('Plant not found');
  }

  // Convert Decimal to number
  return {
    ...plant,
    price: plant.price.toNumber(),
    discountPrice: plant.discountPrice.toNumber(),
  };
}




export async function getRelatedPlants(genus: string, price: number, maxRelatedPlants = 6) {
  try {

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


    let allRelatedPlants = [...relatedPlantsByGenus];

    // If we have fewer than the required number of related plants, fetch additional plants
    if (relatedPlantsByGenus.length < maxRelatedPlants) {

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

      allRelatedPlants = [...allRelatedPlants, ...randomPlants];
    }

    // Shuffle the combined list
    const shuffledPlants = shuffleArray(allRelatedPlants);

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


export async function getGenuses() {
  try {
    const genuses = await prisma.plant.findMany({
      distinct: ['genus'],
      select: { genus: true },
    });
    const genusNames = genuses.map(plant => plant.genus);
    return { genuses: genusNames };
  } catch (error) {
    console.error("Error fetching genuses:", error);
    return { error: "Failed to fetch genuses" };
  }
}


export async function getCategories() {
  try {
    const categories = await prisma.plantCategory.findMany({
      select: { name: true },  // Fetching only the name field
    });
    const categoryNames = categories.map((category) => category.name);
    return { categories: categoryNames };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Failed to fetch categories" };
  }
}

