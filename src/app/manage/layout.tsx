import React, { ReactNode } from 'react';
import Link from 'next/link';


interface ManageLayoutProps {
  children: ReactNode;
}

const ManageLayout: React.FC<ManageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-6">
        <nav className="mb-6">
          <ul className="flex space-x-4">
            <li>
              <Link href="/manage/plants" className="btn btn-outline btn-primary">
                Manage Plants
              </Link>
            </li>
            <li>
              <Link href="/manage/images" className="btn btn-outline btn-secondary">
                Manage Images
              </Link>
            </li>
          </ul>
        </nav>
        <div className="bg-white shadow-md rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ManageLayout;
