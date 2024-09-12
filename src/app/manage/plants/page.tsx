import React from 'react';
import ManagePlantsForm from '@/components/managePlantsForm';
import PlantTable from '@/components/managePlantsTable';
import AppendImageToPlant from '@/components/appendImageToPlant';
import ToggleSection from '@/components/toggleSection';
import { getCategories } from '@/server/categories';

const ManagePlantsPage: React.FC = async () => {
  let categories = [];
  let errorMessage = '';

  try {
    const result = await getCategories();
    
    if ('error' in result) {
      errorMessage = result.error;
    } else {
      categories = result;  // Successfully fetched categories
    }
  } catch (error) {
    errorMessage = 'Failed to fetch categories. Please try again later.';
    console.error("Error fetching categories:", error);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Plants</h1>

      {/* Display error message if categories couldn't be fetched */}
      {errorMessage ? (
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      ) : (
        <>
          {/* Toggleable section for Plant Creation */}
          <ToggleSection title="Create a New Plant">
            <ManagePlantsForm />
          </ToggleSection>

          {/* Toggleable section for Appending Image to Plant */}
          <ToggleSection title="Append Image to Plant">
            <AppendImageToPlant />
          </ToggleSection>

          {/* Section for the Plant Table with Edit functionality */}
          <ToggleSection title="Manage Existing Plants">
            <PlantTable categories={categories} />
          </ToggleSection>
        </>
      )}
    </div>
  );
};

export default ManagePlantsPage;
