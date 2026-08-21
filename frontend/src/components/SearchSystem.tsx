import React from 'react';
import { SearchSystemProps } from '../types/components';
import { UI_CONSTANTS } from '../utils/constants';

/**
 * SearchSystem Component
 * 
 * Provides real-time search functionality for the library interface.
 * Implements requirements 4.1-4.5 from the enhanced library interface spec.
 * 
 * Features:
 * - Search input with placeholder "Search your library..." (Requirement 4.1)
 * - Real-time filtering by title and author (Requirement 4.2)
 * - Case-insensitive matching (Requirement 4.3)
 * - Maintains search state during category filtering (Requirement 4.4)
 * - Rounded corners, amber focus ring, and full width styling (Requirement 4.5)
 * 
 * @param searchQuery - Current search query string
 * @param onSearchChange - Callback function triggered on search input change
 * @param placeholder - Optional custom placeholder text (defaults to "Search your library...")
 */
const SearchSystem: React.FC<SearchSystemProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = UI_CONSTANTS.SEARCH_PLACEHOLDER
}) => {
  /**
   * Handle input change events
   * Requirement 4.2: Real-time filtering by calling onSearchChange callback
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onSearchChange(newValue);
  };

  /**
   * Handle input clear
   * Provides easy way to clear the search query
   */
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="w-full responsive-container mb-4 md:mb-6">
      <div className="relative">
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2 md:py-3 pl-10 pr-10
            bg-white border border-gray-200
            rounded-lg
            text-gray-900 placeholder-gray-500 responsive-text-base
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
            transition-all duration-200
            shadow-sm hover:shadow-md
            responsive-interactive
          `}
        />

        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-4 h-4 md:w-5 md:h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Clear Button (shown when there's a search query) */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2
              p-1 rounded-full
              text-gray-400 hover:text-gray-600
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1
              responsive-interactive
            `}
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Indicator */}
      {searchQuery && (
        <div className="mt-2 responsive-text-sm text-gray-500">
          <span>Searching for: "</span>
          <span className="font-medium text-gray-700">{searchQuery}</span>
          <span>"</span>
        </div>
      )}
    </div>
  );
};

export default SearchSystem;