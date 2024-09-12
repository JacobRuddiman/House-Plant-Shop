"use client";

import React, { useState, useEffect } from "react";
import { createReview, getReviewsForPlant } from "@/server/reviews";
import { FaStar } from "react-icons/fa";

interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewer: string;
  createdAt: string;
}

interface PlantReviewsProps {
  plantId: number;
}

const PlantReviews: React.FC<PlantReviewsProps> = ({ plantId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "", reviewer: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0); // For hover effect on stars

  // Fetch all reviews for the plant
  const fetchReviews = async () => {
    try {
      const { reviews } = await getReviewsForPlant({ plantId });

      // Convert createdAt from Date to string (ISO format)
      const formattedReviews = reviews.map((review: any) => ({
        ...review,
        createdAt: new Date(review.createdAt).toISOString(),
      }));

      setReviews(formattedReviews);
    } catch (error) {
      setError("Failed to fetch reviews");
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [plantId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle review submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createReview({
        rating: newReview.rating,
        comment: newReview.comment,
        reviewer: newReview.reviewer,
        plantId,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setNewReview({ rating: 0, comment: "", reviewer: "" }); // Reset the form
        setHoverRating(0); // Reset hover rating
        fetchReviews(); // Refresh the list of reviews
      }
    } catch (error) {
      setError("Failed to submit review");
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render stars for rating input
  const renderStarInput = () => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setNewReview(prev => ({ ...prev, rating: starValue }))}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <FaStar
                size={24}
                color={
                  starValue <= (hoverRating || newReview.rating)
                    ? "#ffc107"
                    : "#e4e5e9"
                }
              />
            </button>
          );
        })}
      </div>
    );
  };

  // Render stars for displaying existing reviews
  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <FaStar
            key={index}
            size={16}
            color={index < rating ? "#ffc107" : "#e4e5e9"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8" id="reviews">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {/* Review List */}
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="mb-4 border-b pb-4">
              <div className="flex items-center justify-between">
                <p className="font-bold">{review.reviewer}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center">
                {renderStars(review.rating)}
                <span className="ml-2">{review.rating}/5</span>
              </div>
              <p className="mt-2">{review.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      {/* New Review Form */}
      <form onSubmit={handleSubmit} className="mt-8">
        <h3 className="text-xl font-bold mb-4">Leave a Review</h3>

        {/* Reviewer Name */}
        <div className="form-control mb-4">
          <label className="label">Your Name</label>
          <input
            type="text"
            name="reviewer"
            value={newReview.reviewer}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Rating */}
        <div className="form-control mb-4">
          <label className="label">Rating</label>
          {renderStarInput()}
        </div>

        {/* Comment */}
        <div className="form-control mb-4">
          <label className="label">Comment</label>
          <textarea
            name="comment"
            value={newReview.comment}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default PlantReviews;
