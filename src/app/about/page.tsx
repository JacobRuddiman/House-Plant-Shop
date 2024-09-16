'use client';

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="w-3/4 mx-auto text-center p-8 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 tracking-wide">
        About the website
      </h1>

      <div className="space-y-12 text-left">
        {/* Section 1: Our Mission */}
        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-4"></h2>
          <p className="text-lg text-gray-600 mb-4">
            This website is a simple shop webfront to show my ability in creating a responsive website using a number of technologies, many of which I use regularly at PromptBros.
          </p>
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Next.js with server actions</li>
            <li>Prisma ORM</li>
            <li>Heroku</li>
          </ul>
        </section>

        {/* Section 2: Our Values */}
        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Values</h2>
          <p className="text-lg text-gray-600 mb-4">
            We believe in integrity, transparency, and respect. Our core values guide everything we do, ensuring we remain committed to ethical and sustainable practices.
          </p>
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Integrity and transparency</li>
            <li>Respect for customers and employees</li>
            <li>Commitment to sustainability</li>
          </ul>
        </section>

        {/* Section 3: Our Team */}
        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Our Team</h2>
          <p className="text-lg text-gray-600 mb-4">
            Our team consists of experienced professionals who are passionate about what they do. Together, we work to bring our vision to life and continuously strive to exceed expectations.
          </p>
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Experts in their respective fields</li>
            <li>Collaborative and supportive culture</li>
            <li>Driven by passion and innovation</li>
          </ul>
        </section>

        {/* Section 4: Our History */}
        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Our History</h2>
          <p className="text-lg text-gray-600 mb-4">
            Founded in 2010, we have grown from a small startup to an established brand with a reputation for excellence. Over the years, we have achieved significant milestones.
          </p>
          <ul className="list-disc list-inside text-left text-gray-600">
            <li>Founded in 2010 with a small team</li>
            <li>Expanded our services nationwide</li>
            <li>Recognized for our industry-leading solutions</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
