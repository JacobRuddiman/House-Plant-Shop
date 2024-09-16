'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import { getCategories } from '@/server/plants'; // Import the server-side function

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categoryImages: { [key: string]: string } = {
    Succulents: '/images/succulents.webp',
    Ferns: '/images/ferns.webp',
    Cacti: '/images/cacti.webp',
    Orchids: '/images/orchids.webp',
    Tropical: '/images/tropicals.webp',
    // Add more images here
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const response = await getCategories();

      if ('error' in response) {
        setError(response.error);
        setLoading(false);
        return;
      }

      const categoriesWithImages = response.categories.map((category: string, index: number) => ({
        id: index, // Use index as a placeholder for id
        name: category,
        imageUrl: categoryImages[category] || '/images/default.jpg', // Fallback to a default image
      }));

      setCategories(categoriesWithImages);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/shop?category=${encodeURIComponent(category.name)}`} // Add the category to the URL
          passHref
        >
          <div className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
            <img src={category.imageUrl} alt={category.name} className="object-cover w-full h-48" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <span className="text-white text-2xl font-bold">{category.name}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
