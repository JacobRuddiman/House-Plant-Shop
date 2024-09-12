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

// Create a new review for a specific plant
export async function createReview(data: CreateReviewInput) {
  try {
    const newReview = await prisma.review.create({
      data: {
        rating: Math.min(Math.max(data.rating, 0), 5), // Rating between 0 and 5
        comment: data.comment,
        reviewer: data.reviewer,
        plantId: data.plantId,
      },
    });
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
