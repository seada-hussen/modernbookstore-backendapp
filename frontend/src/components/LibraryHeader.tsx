import React from 'react';
import { LibraryHeaderProps } from '../types/components';

/**
 * LibraryHeader Component
 * 
 * Displays the main library header with book count and add book functionality.
 * Implements requirements 3.1-3.5 from the enhanced library interface spec.
 * 
 * Features:
 * - Display "My Library" heading (Requirement 3.1)
 * - Show book count in format "{count} books on your shelf" (Requirement 3.2)
 * - Admin-only "Add a book" button (Requirement 3.3)
 * - Max-width container (6xl) for consistent layout (Requirement 3.4)
 * - Positioned at top of main content area (Requirement 3.5)
 * 
 * @param bookCount - Total number of books in the collection
 * @param userRole - The user's role (admin/user) for conditional rendering
 * @param onAddBook - Callback function to handle add book action
 */
const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  bookCount,
  userRole,
  onAddBook
}) => {
  return (
    <div className="responsive-container flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
      {/* Library title and book count section */}
      <div>
        {/* Requirement 3.1: Display "My Library" as primary heading */}
        <h1 className="responsive-heading text-gray-900">My Library</h1>
        
        {/* Requirement 3.2: Show book count in exact format "{count} books on your shelf" */}
        <p className="responsive-text-sm text-gray-500">
          {bookCount} books on your shelf
        </p>
      </div>

      {/* Requirement 3.3: Show "Add a book" button only for admin role users */}
      {userRole === 'admin' && (
        <button
          onClick={onAddBook}
          className="bg-gray-900 text-white px-3 py-2 md:px-4 md:py-2 rounded-full responsive-text-sm font-semibold hover:bg-gray-800 transition shadow-sm responsive-interactive"
          type="button"
        >
          + Add a book
        </button>
      )}
    </div>
  );
};

export default LibraryHeader;