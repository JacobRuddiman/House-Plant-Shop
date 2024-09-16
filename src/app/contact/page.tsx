'use client';

import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  return (
    <div className="w-3/4 mx-auto text-center p-6 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-extrabold mb-12 text-gray-800 tracking-wide">
        Get In Touch
      </h1>

      <div className="space-y-10 text-lg">
        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Email Me</h2>
          <p className="text-xl text-gray-600">
            <a
              href="mailto:jacobruddiman@gmail.com"
              className="ml-2 text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              jacobruddiman@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Links</h2>
          <div className="flex justify-center space-x-8 text-gray-600">
            <a
              href="https://github.com/JacobRuddiman/House-Plant-Shop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-black transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={40} />
            </a>
            <a
              href="https://www.linkedin.com/in/jacobruddiman/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={40} />
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Business Hours</h2>
          <p className="text-xl text-gray-600">Monday - Friday: 8 AM - 6 PM</p>
          <p className="text-xl text-gray-600">Saturday - Sunday: 10 AM - 4 PM</p>
        </section>

        
      </div>
    </div>
  );
};

export default ContactPage;
``
