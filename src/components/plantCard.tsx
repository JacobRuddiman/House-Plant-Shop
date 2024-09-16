import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Link from 'next/link';

interface PlantCardProps {
  scientificName: string;
  commonName: string;
  genus: string;
  species: string;
  description: string;
  price: number;
  discountPrice: number;
  count: number;
  imageUrl: string;
  rating: number;
  isDiscounted: boolean; // Add this prop to check if the plant is discounted
  id: number;
}

const PlantCard: React.FC<PlantCardProps> = ({
  scientificName,
  commonName,
  genus,
  species,
  description,
  price,
  discountPrice,
  count,
  imageUrl,
  rating,
  isDiscounted, // Now handling this prop
  id,
}) => {
  const stockMessage = count > 10 ? "In Stock" : `Only ${count} left`;
  const badgeColor = count > 10 ? "bg-primary text-primary-content" : count > 0 ? "bg-primary-warning text-primary-content" : "bg-primary-error text-primary-content";

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="text-yellow-500 text-lg flex">
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

  return (
    <div className="card bg-base-100 shadow-xl h-full cursor-pointer">
      <Link href={`/product/${id}`} passHref>
        <figure className="cursor-pointer">
          <img src={imageUrl} alt={commonName} className="object-contain w-full" />
        </figure>
      </Link>
      <div className="card-body p-4 flex flex-col justify-between">
        <div>
          <h2 className="card-title flex-col items-start">
            <Link className='w-full'  href={`/product/${id}`} passHref>
              <div className="flex-row flex justify-between w-full cursor-pointer">
                <div>{commonName}</div>
                <div className='justify-end flex'>
                  <div className={`badge ${badgeColor} custom-badge flex-col items-center text-center ml-auto`}>
                    <span className="badge-count">{stockMessage}</span>
                  </div>
                </div>
              </div>
            </Link>
            <div className="text-base">
              ({scientificName})
            </div>
          </h2>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            {isDiscounted ? (
              <>
                <p className="text-lg font-semibold text-green-600">${discountPrice}</p>
                <p className="text-sm text-gray-500 line-through">${price}</p>
              </>
            ) : (
              <p className="text-lg font-semibold">${price}</p>
            )}
          </div>
          <Link href={`/shop?genus=${genus}`} passHref>
            <div className="badge badge-outline cursor-pointer">{genus}</div>
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link href={`/product/${id}#reviews`} passHref>
            <div className="flex items-center cursor-pointer">
              {renderStars(rating)}
              <span className="text-sm text-gray-500 ml-2">{rating.toFixed(1)}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
