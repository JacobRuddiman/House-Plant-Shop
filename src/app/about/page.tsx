'use client';

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="w-3/4 mx-auto text-center p-8 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 tracking-wide">
        About the Website
      </h1>

      <div className="space-y-12">
        {/* Section 1: Website Mission */}
        <section>
          <p className="text-lg text-gray-600 mb-4">
            This website serves as a demonstration of my ability to build responsive and modern web applications, using the latest technologies I regularly employ at PromptBros. I chose Heroku for cost reasons,
            and this along with Postgres were new to me for this project.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Next.js with server actions</li>
            <li>Tailwind for styling</li>
            <li>Prisma ORM for database management</li>
            <li>Heroku for hosting</li>
            <li>Postgres for the database</li>
          </ul>
        </section>

        {/* Section 2: Website Features */}
        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Website Features</h2>
          <p>The website has all the features of a shop front, excluding checkout</p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Product Listings</li>
            <li>Product Search and Filter</li>
            <li>Basket</li>
            <li>User Reviews and Ratings</li>
            <li>Backend management pages for adding and managing plants</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
