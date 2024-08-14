"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getGenuses } from '@/server/plants'; // Adjust the path based on your project structure

interface GenusDropdownProps {}

const GenusDropdown: React.FC<GenusDropdownProps> = () => {
  const [genuses, setGenuses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchGenuses = async () => {
      const result = await getGenuses();
      if (!result.error) {
        setGenuses(result.genuses || []);
      }
      setLoading(false);
    };

    fetchGenuses();
  }, []);

  const handleGenusClick = (genus: string) => {
    router.push(`/shop?genus=${genus}`);
    setDropdownOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dropdown relative">
      <div
        className={`cursor-pointer p-2 ${dropdownOpen ? 'bg-white text-black rounded-t-md border-b border-gray-300' : 'text-black'} no-hover`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        Select Genus
      </div>
      {dropdownOpen && (
        <ul className="dropdown-menu grid grid-cols-5 gap-2 bg-white border rounded-t-md rounded-b-md shadow-md absolute left-1/2 transform -translate-x-1/2 mt-0 min-w-max">
          {genuses.map((genus) => (
            <li
              key={genus}
              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-center min-w-max"
              onClick={() => handleGenusClick(genus)}
            >
              {genus}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GenusDropdown;
