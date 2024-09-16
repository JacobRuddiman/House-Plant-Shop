'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getPlant, getRelatedPlants } from "@/server/plants";
import { useParams } from 'next/navigation';
import ImageGallery from '@/components/productImageGallery';
import PlantCard from '@/components/plantCard';
import PlantReviews from '@/components/plantReviews';
import AddToBasket from '@/components/addToBasket';

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
  images: { id: number; url: string; plantId: number | null }[];
  rating: number;
  isDiscounted: boolean;
}

const ProductPage = () => {
  const params = useParams();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [relatedPlants, setRelatedPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const plantData = await getPlant(parseInt(id, 10));
        setPlant(plantData);
      } catch (error) {
        setError('Plant not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [params.id]);

  useEffect(() => {
    if (plant) {
      const fetchRelatedPlants = async () => {
        try {
          const relatedPlantsData = await getRelatedPlants(plant.genus, plant.price);
          setRelatedPlants(relatedPlantsData);
        } catch (error) {
          console.error("Error fetching related plants:", error);
        }
      };

      fetchRelatedPlants();
    }
  }, [plant]);

  useEffect(() => {
    if (window.location.hash === '#reviews') {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="text-yellow-500 text-lg flex ml-2">
        {Array.from({ length: fullStars }, (_, index) => (
          <FaStar key={`full-${index}`} />
        ))}
        {halfStar && <FaStarHalfAlt key="half" />}
        {Array.from({ length: emptyStars }, (_, index) => (
          <FaRegStar key={`empty-${index}`} />
        ))}
      </span>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!plant) {
    return <div>Plant not found</div>;
  }

  const imageUrls = plant.images.map(image => image.url);

  return (
    <div className="w-screen"> {/* Full screen width container */}
      <div className="flex w-full p-4"> {/* Full width */}
        {/* Image Gallery on the Left */}
        <div className="flex-1 mt-2 h-auto">
          <ImageGallery images={imageUrls}></ImageGallery>
        </div>

        {/* Product Information on the Right */}
        <div className="flex-1 ml-10">
          {/* Header Section */}
          <header className="mb-8">
            <h1 className="text-6xl font-bold flex items-center">
              {plant.commonName}
            </h1>
            <p className="text-2xl my-2">{plant.genus} {plant.species}</p>
            <div className="my-2 flex"> {renderStars(plant.rating)} </div>
          </header>

          <div className="mb-8">
            <div className="flex items-center">
              <div>
                {/* Price display logic */}
                {plant.isDiscounted ? (
                  <>
                    <p className="text-3xl font-bold text-red-600">${plant.discountPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 line-through">${plant.price.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="text-3xl font-bold">${plant.price.toFixed(2)}</p>
                )}
              </div>
            </div>
            <p className="mt-4">{plant.count > 10 ? 'In Stock' : `Only ${plant.count} left`}</p>
            <div className="flex">
              <AddToBasket plantId={plant.id} name={plant.commonName} price={plant.isDiscounted ? plant.discountPrice : plant.price} />
            </div>
          </div>

          {/* Description */}
          <section className="mb-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p>{plant.description}</p>
          </section>

          {/* Specifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <ul>
              <li><strong>Genus:</strong> {plant.genus}</li>
              <li><strong>Species:</strong> {plant.species}</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16 w-full">
        <div className='my-4'>
          <h2 className="text-3xl font-bold mb-4">Related Products</h2>
          <div className="flex gap-4">
            {relatedPlants.map((relatedPlant) => {
              const imageUrl = relatedPlant.images && relatedPlant.images.length > 0 ? relatedPlant.images[0].url : '';
              return (
                <PlantCard
                  key={relatedPlant.id}
                  id={relatedPlant.id}
                  scientificName={relatedPlant.scientificName}
                  commonName={relatedPlant.commonName}
                  genus={relatedPlant.genus}
                  species={relatedPlant.species}
                  description={relatedPlant.description}
                  price={relatedPlant.price}
                  discountPrice={relatedPlant.discountPrice}
                  count={relatedPlant.count}
                  imageUrl={imageUrl}
                  rating={relatedPlant.rating}
                  isDiscounted={relatedPlant.isDiscounted}
                />
              );
            })}
          </div>
        </div>
      </section>
      <section>
        <PlantReviews plantId={plant.id}/>
      </section>
    </div>
  );
};

export default ProductPage;
