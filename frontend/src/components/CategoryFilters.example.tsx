import React, { useState } from 'react';
import { CategoryFilters } from './index';
import { BOOK_CATEGORIES } from '../types/book';

/**
 * CategoryFilters Usage Example
 * 
 * This example demonstrates how to integrate the CategoryFilters component
 * into your library interface. Replace the existing basic filter buttons
 * with this enhanced component.
 */
const CategoryFiltersExample: React.FC = () => {
  // Example state management
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Example book counts - in real usage, calculate these from your book data
  const bookCounts = {
    'Quran': 12,
    'Tafsir': 8,
    'Hadith': 15,
    'Sira': 5,
    'Fiqh': 10
  };

  /**
   * Handle category changes
   * In your main component, this would update the book filtering logic
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    console.log(`Filtering by category: ${category}`);
    // Add your filtering logic here
    // Example: setFilteredBooks(filterBooksByCategory(allBooks, category));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          CategoryFilters Component Example
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Enhanced Category Filtering
          </h2>
          
          {/* CategoryFilters Component Integration */}
          <CategoryFilters
            categories={BOOK_CATEGORIES}
            selectedCategory={selectedCategory}
            bookCounts={bookCounts}
            onCategoryChange={handleCategoryChange}
          />
          
          {/* Example of how to use the selected category */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">
              Current State Example:
            </h3>
            <p className="text-amber-700">
              Selected Category: <strong>{selectedCategory}</strong>
            </p>
            <p className="text-amber-600 text-sm mt-1">
              In your main component, use this value to filter your books array
            </p>
          </div>
        </div>
        
        {/* Integration Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            Integration Instructions
          </h3>
          <div className="space-y-3 text-blue-700">
            <div>
              <strong>1. Replace existing filter buttons:</strong>
              <p className="text-sm text-blue-600 ml-4">
                Remove the current category filter buttons in Books.tsx and replace with CategoryFilters component
              </p>
            </div>
            <div>
              <strong>2. Calculate book counts:</strong>
              <p className="text-sm text-blue-600 ml-4">
                Create a function to count books by category from your books array
              </p>
            </div>
            <div>
              <strong>3. Connect to filtering logic:</strong>
              <p className="text-sm text-blue-600 ml-4">
                Update your existing filtering logic to use the onCategoryChange callback
              </p>
            </div>
            <div>
              <strong>4. Maintain search integration:</strong>
              <p className="text-sm text-blue-600 ml-4">
                Ensure category filtering works together with search functionality
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFiltersExample;