'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GenusDropdown from './GenusDropdown';
import BasketIcon from './basketIcon';

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // If the search term is empty, redirect to the shop page without any query
    if (searchTerm.trim() === '') {
      router.push('/shop');
    } else {
      // If there's a search term, include it in the query parameters
      router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar bg-primary h-20">
      <div className="flex-1 h-full">
        <Link href="/home" className='h-full object-contain'>
          <img src="/images/logoplant.png" className="h-full object-contain" alt="Logo" />
        </Link>
      </div>
      <div className="flex-none text-white">
        <ul className="menu menu-horizontal p-0 items-center text-base">
          <li><Link href="/shop">Shop</Link></li>
          <GenusDropdown />
          <li><Link href="/shop?isDiscounted=true">Offers</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li>
            <form onSubmit={handleSearch}>
              <div className="form-control">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="input input-bordered h-9 text-black" // Added text-black for black text
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </li>
          <li>
            <BasketIcon />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
