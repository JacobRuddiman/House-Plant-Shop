import React from 'react';

const Promotion: React.FC = () => {
  const imageUrl = '/images/be24c29f-1584-4df5-b254-70a6b3c97ef2.webp'; // Example image URL
  const header = 'Special Promotion';
  const text = "Don't miss out on our exclusive offer! Limited time only.";

  return (
    <div className="flex bg-secondary text-secondary-content rounded-lg overflow-hidden">
      <div className="w-1/2 h-full">
        <img src={imageUrl} alt="Promotion" className="object-cover h-full w-full" />
      </div>
      <div className="w-1/2 p-8 flex flex-col justify-center items-end">
        <h1 className="text-5xl font-bold mb-20">{header}</h1>
        <h2 className='text-4xl mb-16'>15% Off Sitewide</h2>
        <p className="text-2xl">{text}</p>
      </div>
    </div>
  );
};

export default Promotion;