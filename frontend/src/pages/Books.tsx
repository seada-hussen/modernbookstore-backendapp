import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBooks from '../hooks/useBooks';
import { SidebarNavigation, LibraryHeader, SearchSystem, AddBookModal } from '../components';
import CategoryFilters from '../components/CategoryFilters';
import { UserRole } from '../types/user';
import { BOOK_CATEGORIES, CreateBookData } from '../types/book';
import { booksService } from '../services/bookService';

export default function Books() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  // Use the enhanced books hook with automatic refresh and error handling
  const {
    books,
    filteredBooks,
    groupedBooks,
    categoryCount,
    loading,
    error,
    selectedCategory,
    searchQuery,
    refreshing,
    createBook,
    setSearchQuery,
    setSelectedCategory,
    clearError,
  } = useBooks();

  // Get user role from service with admin operations support
  const userRole: UserRole = (booksService.getUserRole() as UserRole) || 'admin';

  const handleAddBook = async (bookData: CreateBookData) => {
    try {
      await createBook(bookData);
      setIsAddModalOpen(false);
      // Data refresh is handled automatically by useBooks hook
    } catch (err: any) {
      // Error is already handled in the hook, just re-throw for modal handling
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex">
      {/* Sidebar Navigation Component - Hidden on mobile < 768px by CSS */}
      <SidebarNavigation 
        userRole={userRole} 
        onLogout={handleLogout}
      />

      {/* Main Content Area - Responsive layout */}
      <main className="flex-1 responsive-padding overflow-y-auto main-content-mobile md:main-content-desktop">
        {/* Responsive container for consistent layout */}
        <div className="responsive-container">
          {/* Library Header Component - Requirements 3.1-3.5 */}
          <LibraryHeader 
            bookCount={books.length}
            userRole={userRole}
            onAddBook={() => setIsAddModalOpen(true)}
          />

          {/* Search System Component - Requirements 4.1-4.5 */}
          <SearchSystem 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Enhanced Category Filters Component - Requirements 5.1-5.5 */}
          <CategoryFilters 
            categories={BOOK_CATEGORIES}
            selectedCategory={selectedCategory}
            bookCounts={categoryCount}
            onCategoryChange={setSelectedCategory}
          />

          {/* Enhanced error handling with user-friendly messages and retry option */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading books...</span>
              </div>
            </div>
          )}

          {/* Responsive Bookshelf View */}
          {!loading && (
            <div className="space-y-8 md:space-y-12">
              {Object.keys(groupedBooks).length > 0 ? (
                Object.keys(groupedBooks).map((category) => (
                  <div key={category} className="bg-[#f5f1e9] responsive-padding rounded-2xl shadow-sm border border-amber-100/60">
                    <div className="flex items-center gap-2 mb-4 md:mb-6 text-gray-800 font-semibold">
                      <span className="text-lg md:text-xl">📖</span>
                      <span className="responsive-text-base md:text-lg">{category}</span>
                      <span className="responsive-text-sm text-gray-500 font-normal">({groupedBooks[category].length})</span>
                      {refreshing && (
                        <svg className="animate-spin h-4 w-4 text-amber-600 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </div>

                    {/* Responsive Grid Layout - Requirements 9.2: 2 columns mobile to 5 columns large screens */}
                    <div className="responsive-book-grid">
                      {groupedBooks[category].map((book: any, index: number) => (
                        <div key={book._id || book.id || index} className="responsive-book-card">
                          <div>
                            {/* Responsive book cover */}
                            <div className="responsive-book-cover flex items-center justify-center overflow-hidden">
                              {book.image ? (
                                <img 
                                  src={book.image} 
                                  alt={book.title} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    // Fallback to text display if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentNode as HTMLElement;
                                    const textSpan = document.createElement('span');
                                    textSpan.className = 'text-amber-800 font-bold text-center px-2 responsive-text-sm';
                                    textSpan.textContent = book.title;
                                    parent.appendChild(textSpan);
                                  }}
                                />
                              ) : (
                                <span className="text-amber-800 font-bold text-center px-2 responsive-text-sm">{book.title}</span>
                              )}
                            </div>
                            {/* Responsive text sizing */}
                            <h3 className="font-bold text-gray-800 responsive-text-sm line-clamp-1 mb-1">{book.title}</h3>
                            <p className="text-gray-500 text-xs mb-2">{book.author}</p>
                          </div>
                          <div>
                            <div className="text-green-600 font-bold responsive-text-sm mb-2">${book.price ?? '0.00'}</div>
                            {/* Responsive interactive element */}
                            <button className="w-full bg-amber-700 text-white py-1.5 responsive-text-sm rounded-md hover:bg-amber-800 responsive-interactive transition-colors">
                              Order Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Decorative shelf with responsive spacing */}
                    <div className="mt-4 md:mt-6 h-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-full shadow-inner"></div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-gray-600 responsive-text-base">No books found.</p>
                    {selectedCategory !== 'All' || searchQuery ? (
                      <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Add Book Modal Component - Requirements 8.1-8.5 */}
      <AddBookModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBook}
        categories={BOOK_CATEGORIES}
      />
    </div>
  );
}