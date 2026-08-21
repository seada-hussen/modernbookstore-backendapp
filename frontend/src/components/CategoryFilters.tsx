import React from 'react';
import { CategoryFiltersProps } from '../types/components';
import { BOOK_CATEGORIES } from '../types/book';

/**
 * CategoryFilters Component
 * 
 * Provides category-based filtering for the library interface.
 * Implements requirements 5.1-5.5 from the enhanced library interface spec.
 * 
 * Features:
 * - Filter buttons for All, Quran, Tafsir, Hadith, Sira, Fiqh (Requirement 5.1)
 * - Display book count next to each category name (Requirement 5.2)
 * - Active filter highlighting with amber styling (Requirement 5.3)
 * - Maintains filter state while searching (Requirement 5.4, 5.5)
 * 
 * @param categories - Array of available book categories 
 * @param selectedCategory - Currently selected category filter
 * @param bookCounts - Count of books for each category
 * @param onCategoryChange - Callback function triggered on category selection
 */
const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategory,
  bookCounts,
  onCategoryChange
}) => {
  /**
   * Handle category filter selection
   * Requirement 5.3: Updates selected category and triggers callback
   */
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  /**
   * Calculate total book count across all categories
   */
  const totalBookCount = Object.values(bookCounts).reduce((sum, count) => sum + count, 0);

  /**
   * Get the count for a specific category, defaulting to 0 if not found
   */
  const getCategoryCount = (category: string): number => {
    if (category === 'All') {
      return totalBookCount;
    }
    return bookCounts[category] || 0;
  };

  /**
   * Check if a category is currently selected
   * Requirement 5.3: Used for active state highlighting
   */
  const isSelected = (category: string): boolean => {
    return selectedCategory === category;
  };

  /**
   * Get button classes based on selection state
   * Requirement 5.3: Apply amber styling for active filters
   */
  const getButtonClasses = (category: string, count: number): string => {
    const baseClasses = `
      inline-flex items-center justify-between
      px-2 py-2 md:px-4 md:py-3 rounded-lg
      responsive-text-sm font-medium
      transition-all duration-200
      border border-gray-200
      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
      responsive-interactive
    `;

    const selectedClasses = `
      bg-amber-50 border-amber-200 text-amber-800
      shadow-sm
    `;

    const unselectedClasses = `
      bg-white hover:bg-gray-50 text-gray-700
      hover:border-gray-300 hover:shadow-sm
    `;

    const disabledClasses = count === 0 ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${isSelected(category) ? selectedClasses : unselectedClasses} ${disabledClasses}`.trim();
  };

  // All available filter options including "All"
  const allFilterOptions = ['All', ...categories];

  return (
    <div className="w-full responsive-container mb-4 md:mb-6">
      {/* Category Filters Header */}
      <div className="mb-3 md:mb-4">
        <h3 className="responsive-text-base md:text-lg font-semibold text-gray-800 mb-2">
          Filter by Category
        </h3>
        <p className="responsive-text-sm text-gray-600">
          Browse books by Islamic categories or view all books
        </p>
      </div>

      {/* Filter Buttons Container - Responsive grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
        {allFilterOptions.map((category) => {
          const count = getCategoryCount(category);
          const isCurrentlySelected = isSelected(category);
          const isDisabled = count === 0;

          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              disabled={isDisabled}
              className={getButtonClasses(category, count)}
              aria-pressed={isCurrentlySelected}
              aria-label={`Filter by ${category} category, ${count} books available`}
            >
              {/* Category Name */}
              <span className="flex-1 text-left responsive-text-sm">
                {category}
              </span>

              {/* Book Count Badge */}
              <span 
                className={`
                  ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold
                  ${isCurrentlySelected 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicator */}
      {selectedCategory && selectedCategory !== 'All' && (
        <div className="mt-3 md:mt-4 flex flex-col sm:flex-row sm:items-center responsive-text-sm text-gray-600">
          <span>Currently viewing: </span>
          <span className="sm:ml-1 font-medium text-amber-700">
            {selectedCategory}
          </span>
          <span className="sm:ml-1">
            ({getCategoryCount(selectedCategory)} books)
          </span>
          <button
            type="button"
            onClick={() => handleCategoryClick('All')}
            className="mt-1 sm:mt-0 sm:ml-2 text-amber-600 hover:text-amber-700 underline focus:outline-none responsive-interactive self-start"
          >
            View all categories
          </button>
        </div>
      )}

      {/* Empty State Message */}
      {totalBookCount === 0 && (
        <div className="mt-4 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center text-gray-500">
            <svg
              className="mx-auto h-6 w-6 md:h-8 md:w-8 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="responsive-text-sm">No books available in any category</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilters;