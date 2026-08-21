import React from 'react';
import { BookshelfViewProps } from '../types/components';
import { BOOK_CATEGORIES } from '../types/book';
import { UI_CONSTANTS } from '../utils/constants';
import BookSpine from './BookSpine';

/**
 * BookshelfView Component
 * 
 * Displays books grouped by Islamic categories in a bookshelf-style layout.
 * Implements requirements 6.1, 6.2, 6.4, 6.5 from the enhanced library interface spec.
 * 
 * Features:
 * - Group books by Islamic categories with case-insensitive matching (Requirement 6.1)
 * - Display each category as separate shelf with name and count (Requirement 6.2)  
 * - Implement decorative shelf bottom with amber gradient styling (Requirement 6.4)
 * - Show "No books found" message when no matches (Requirement 6.5)
 * - Responsive grid layout (2-5 columns based on screen size) (Requirement 6.3)
 * 
 * @param groupedBooks - Books grouped by category
 * @param onOrderBook - Optional callback for book ordering
 */
const BookshelfView: React.FC<BookshelfViewProps> = ({
  groupedBooks,
  onOrderBook
}) => {
  // Check if there are any books to display
  const hasBooks = Object.keys(groupedBooks).length > 0 && 
    Object.values(groupedBooks).some(books => books.length > 0);

  // Requirement 6.5: Show "No books found" message when no matches
  if (!hasBooks) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {UI_CONSTANTS.EMPTY_STATE_MESSAGE}
        </h3>
        <p className="text-gray-500 max-w-md">
          Try adjusting your search or category filter to find more books in your collection.
        </p>
      </div>
    );
  }

  // Sort categories to maintain consistent ordering
  // Show only categories that have books and maintain Islamic category order
  const orderedCategories = BOOK_CATEGORIES.filter(category => {
    // Case-insensitive matching to find books in this category
    return Object.keys(groupedBooks).some(bookCategory =>
      bookCategory.toLowerCase() === category.toLowerCase()
    );
  });

  // Add any additional categories not in the main Islamic categories
  const additionalCategories = Object.keys(groupedBooks).filter(category => {
    return !BOOK_CATEGORIES.some(islamicCategory =>
      islamicCategory.toLowerCase() === category.toLowerCase()
    );
  });

  const allCategories = [...orderedCategories, ...additionalCategories];

  return (
    <div className="space-y-8">
      {allCategories.map(category => {
        // Find the actual category key in groupedBooks (case-insensitive)
        const actualCategoryKey = Object.keys(groupedBooks).find(key =>
          key.toLowerCase() === category.toLowerCase()
        );
        
        if (!actualCategoryKey || !groupedBooks[actualCategoryKey]?.length) {
          return null;
        }

        const books = groupedBooks[actualCategoryKey];
        const bookCount = books.length;

        return (
          <div key={category} className="space-y-4">
            {/* Requirement 6.2: Display category name and book count */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {category}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {bookCount} {bookCount === 1 ? 'book' : 'books'}
              </span>
            </div>

            {/* Bookshelf container with decorative styling */}
            <div className="bg-amber-50 rounded-lg responsive-padding border border-amber-100 shadow-sm">
              {/* Books grid - Requirement 6.3: Responsive layout (2-5 columns) */}
              <div className="responsive-book-grid mb-4">
                {books.map((book) => {
                  const bookId = book._id || book.id || `book-${book.title}-${book.author}`;
                  
                  return (
                    <BookSpine
                      key={bookId}
                      book={book}
                      onOrder={onOrderBook}
                    />
                  );
                })}
              </div>

              {/* Requirement 6.4: Decorative shelf bottom with amber gradient styling */}
              <div 
                className="w-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-full shadow-inner"
                style={{ height: UI_CONSTANTS.SHELF_HEIGHT }}
              >
                {/* Inner shadow effect */}
                <div className="w-full h-full bg-gradient-to-b from-transparent via-black/5 to-black/10 rounded-full" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookshelfView;