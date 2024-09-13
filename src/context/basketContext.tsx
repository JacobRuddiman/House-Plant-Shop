'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getBasket, addToBasket, removeFromBasket, clearBasket } from '@/server/basket';

// Define the type for BasketItem
interface BasketItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Define the BasketContext interface
interface BasketContextProps {
  basket: BasketItem[];
  basketCount: number;
  addToBasket: (item: BasketItem) => Promise<void>;
  removeFromBasket: (itemId: number) => Promise<void>;
  clearBasket: () => Promise<void>;
}

// Create the context
export const BasketContext = createContext<BasketContextProps>({
  basket: [],
  basketCount: 0,
  addToBasket: async () => {},
  removeFromBasket: async () => {},
  clearBasket: async () => {},
});

// BasketProvider component
export const BasketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [basketCount, setBasketCount] = useState<number>(0);

  // Fetch the basket when the app starts
  useEffect(() => {
    const fetchBasket = async () => {
      const basketData = await getBasket();
      setBasket(basketData);
      setBasketCount(calculateBasketCount(basketData));
    };
    fetchBasket();
  }, []);

  // Helper function to calculate the total number of items in the basket
  const calculateBasketCount = (basket: BasketItem[]) => {
    return basket.reduce((total, item) => total + item.quantity, 0);
  };

  // Add item to basket and update the state
  const handleAddToBasket = async (item: BasketItem) => {
    await addToBasket(item);
    const updatedBasket = await getBasket(); // Fetch immediately after adding
    setBasket(updatedBasket);
    setBasketCount(calculateBasketCount(updatedBasket)); // Update count immediately
  };

  // Remove item from basket and update the state
  const handleRemoveFromBasket = async (itemId: number) => {
    await removeFromBasket(itemId);
    const updatedBasket = await getBasket(); // Fetch immediately after removing
    setBasket(updatedBasket);
    setBasketCount(calculateBasketCount(updatedBasket));
  };

  // Clear the entire basket and update the state
  const handleClearBasket = async () => {
    await clearBasket();
    setBasket([]);
    setBasketCount(0);
  };

  return (
    <BasketContext.Provider
      value={{
        basket,
        basketCount,
        addToBasket: handleAddToBasket,
        removeFromBasket: handleRemoveFromBasket,
        clearBasket: handleClearBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};
