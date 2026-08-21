import React from 'react';
import { BookSpineProps } from '../types/components';
import { UI_CONSTANTS } from '../utils/constants';

/**
 * BookSpine Component
 * 
 * Displays individual book information as a realistic book spine with cover image,
 * title, author, price, and order functionality.
 * Implements requirements 7.1, 7.2, 7.3, 7.4, 7.5 from the enhanced library interface spec.
 * 
 * Features:
 * - Display book cover image when available (Requirement 7.1)
 * - Show book title on amber background when no image provided (Requirement 7.2)
 * - Show book title, author name, and price below cover area (Requirement 7.3)
 * - Include "Order Now" button with amber styling (Requirement 7.4)
 * - Maintain consistent card styling with white background and shadow (Requirement 7.5)
 * 
 * @param book - Book data to display
 * @param onOrder - Optional callback for book ordering
 */
const BookSpine: React.FC<BookSpineProps> = ({ book, onOrder }) => {
  // Generate consistent book ID for key and order functionality
  const bookId = book._id || book.id || `book-${book.title}-${book.author}`;

  /**
   * Handle order button click
   */
  const handleOrderClick = () => {
    if (onOrder) {
      onOrder(String(bookId));
    }
  };

  /**
   * Handle image error by showing title on amber background
   */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full bg-amber-100 border border-amber-200 flex items-center justify-center p-2">
          <span class="text-amber-800 font-bold text-sm text-center leading-tight">${book.title}</span>
        </div>
      `;
    }
  };

  return (
    <div className="responsive-book-card">
      {/* Book cover section - Requirement 7.1 & 7.2 */}
      <div className="responsive-book-cover rounded-md overflow-hidden flex items-center justify-center">
        {book.image ? (
          // Requirement 7.1: Display book cover image when available
          <img
            src={book.image}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          // Requirement 7.2: Show title on amber background when no image provided
          <div className="w-full h-full bg-amber-100 border border-amber-200 flex items-center justify-center p-2">
            <span className="text-amber-800 font-bold responsive-text-sm text-center leading-tight">
              {book.title}
            </span>
          </div>
        )}
      </div>

      {/* Book information section - Requirement 7.3 */}
      <div className="space-y-2">
        {/* Book title */}
        <h3 
          className="font-semibold text-gray-900 responsive-text-sm leading-tight line-clamp-2"
          title={book.title} // Tooltip for full title on hover
        >
          {book.title}
        </h3>
        
        {/* Author name */}
        <p 
          className="text-gray-600 text-xs"
          title={book.author} // Tooltip for full author name on hover
        >
          {book.author}
        </p>
        
        {/* Price and Order button section */}
        <div className="flex items-center justify-between">
          {/* Book price */}
          <span className="font-bold text-gray-900 responsive-text-sm">
            ${book.price.toFixed(2)}
          </span>
          
          {/* Requirement 7.4: "Order Now" button with amber styling */}
          {onOrder && (
            <button
              onClick={handleOrderClick}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 responsive-interactive"
              aria-label={`Order ${book.title} by ${book.author}`}
            >
              Order Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSpine;