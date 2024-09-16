'use client';

import React, { useContext, useEffect, useState } from 'react';
import { BasketContext } from '@/context/basketContext';
import { getPlant } from '@/server/plants';
import AddToBasket from '@/components/addToBasket';
import Link from 'next/link';

interface BasketItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface PlantWithImage extends BasketItem {
  imageUrl: string;
}

const BasketPage: React.FC = () => {
  const { basket, clearBasket } = useContext(BasketContext);
  const [basketWithImages, setBasketWithImages] = useState<PlantWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchBasketDetails = async () => {
      const basketWithImagesPromises = basket.map(async (item) => {
        const plant = await getPlant(item.id);
        const imageUrl = plant.images.length > 0 ? plant.images[0].url : '';
        return {
          ...item,
          imageUrl,
        };
      });
      const basketWithImages = await Promise.all(basketWithImagesPromises);
      setBasketWithImages(basketWithImages);
      calculateTotal(basketWithImages);
    };

    fetchBasketDetails();
  }, [basket]);

  const calculateTotal = (items: PlantWithImage[]) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleClearBasket = async () => {
    setLoading(true);
    await clearBasket();
    setLoading(false);
  };

  if (loading) {
    return <div>Loading your basket...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Basket</h1>

      {basketWithImages.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="table-auto w-full mb-4 bg-gray-100 rounded-lg p-4"
            style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}
          >
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2">Plant Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {basketWithImages.map((item) => (
                <tr key={item.id} className="bg-white rounded-lg">
                  <td className="px-4 py-2 text-center">
                    <Link href={`/product/${item.id}`} passHref>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-32 h-48 object-cover rounded-lg cursor-pointer" // 3:4 aspect ratio, larger size
                      />
                    </Link>
                  </td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-2">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="px-2 py-2 text-right w-auto">
                    <div className="flex justify-end"> {/* Flex box to align right */}
                      <AddToBasket
                        plantId={item.id}
                        name={item.name}
                        price={item.price}
                        initialQuantity={item.quantity}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mb-4">
            <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
          </div>

          <div className="flex justify-between">
            <button onClick={handleClearBasket} className="btn btn-error">
              Clear Basket
            </button>
            <button className="btn btn-primary">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasketPage;
