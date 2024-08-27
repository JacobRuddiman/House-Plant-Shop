// components/BasketIcon.js

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBasket } from '@/server/basket';

const BasketIcon = () => {
  const [basketCount, setBasketCount] = useState(0);

  useEffect(() => {
    // Fetch initial basket count from the server
    const fetchBasketCount = async () => {
      try {
        const basket = await getBasket();
        setBasketCount(basket.length);
      } catch (error) {
        console.error('Failed to fetch basket count:', error);
      }
    };

    fetchBasketCount();
  }, []);

  return (
    <div className="relative">
      <Link href="/cart">
        <span>Basket</span>
        {basketCount > 0 && (
          <span className="absolute top-0 right-0 inline-block w-5 h-5 text-center text-xs font-bold text-white bg-red-600 rounded-full">
            {basketCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default BasketIcon;
