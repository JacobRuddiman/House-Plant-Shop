"use server";

import prisma from '../lib/prisma';

interface CreateReviewInput {
  rating: number;
  comment: string;
  reviewer: string;
  plantId: number;
}

interface GetReviewsInput {
  plantId: number;
}

// Create a new review for a specific plant and update the plant's rating
export async function createReview(data: CreateReviewInput) {
  try {
    // Create the new review
    const newReview = await prisma.review.create({
      data: {
        rating: Math.min(Math.max(data.rating, 0), 5), // Rating between 0 and 5
        comment: data.comment,
        reviewer: data.reviewer,
        plantId: data.plantId,
      },
    });

    // Recalculate the plant's rating after the new review is added
    await recalculatePlantRating(data.plantId);

    return { newReview };
  } catch (error) {
    console.error("Error creating review:", error);
    return { error: "Failed to create review" };
  }
}

// Get all reviews for a specific plant
export async function getReviewsForPlant({ plantId }: GetReviewsInput) {
  try {
    const reviews = await prisma.review.findMany({
      where: { plantId },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { reviews };
  } catch (error) {
    console.error("Error fetching reviews for plant:", error);
    return { error: "Failed to fetch reviews" };
  }
}

// Helper function to recalculate and update the plant's rating
async function recalculatePlantRating(plantId: number) {
  try {
    // Get all reviews for the plant
    const reviews = await prisma.review.findMany({
      where: { plantId },
    });

    // Calculate the average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Update the plant's rating
    await prisma.plant.update({
      where: { id: plantId },
      data: {
        rating: Math.round(averageRating * 100) / 100, // Keep rating to 2 decimal places
      },
    });
  } catch (error) {
    console.error("Error recalculating plant rating:", error);
  }
}
