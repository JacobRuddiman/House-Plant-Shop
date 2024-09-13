'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { BasketContext } from '@/context/basketContext';

const BasketIcon: React.FC = () => {
  const { basketCount } = useContext(BasketContext); // Use context to get basket count

  return (
    <div className="relative">
      <Link href="/basket">
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
