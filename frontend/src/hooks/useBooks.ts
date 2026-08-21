import { useState, useEffect, useMemo, useCallback } from 'react';
import { Book, CreateBookData, UpdateBookData, BOOK_CATEGORIES } from '../types/book';
import { booksService, ApiError, NetworkError, ValidationError } from '../services/bookService';

interface UseBooksState {
  books: Book[];
  filteredBooks: Book[];
  groupedBooks: Record<string, Book[]>;
  categoryCount: Record<string, number>;
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  refreshing: boolean;
}

interface UseBooksActions {
  fetchBooks: () => Promise<void>;
  createBook: (bookData: CreateBookData) => Promise<Book>;
  updateBook: (id: string, bookData: UpdateBookData) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  refreshBooks: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  clearError: () => void;
}

export interface UseBooksReturn extends UseBooksState, UseBooksActions {}

/**
 * Enhanced custom hook for books state management with automatic refresh
 * and robust error handling
 */
export function useBooks(): UseBooksReturn {
  const [state, setState] = useState<UseBooksState>({
    books: [],
    filteredBooks: [],
    groupedBooks: {},
    categoryCount: {},
    loading: false,
    error: null,
    selectedCategory: 'All',
    searchQuery: '',
    refreshing: false,
  });

  /**
   * Filter books based on search query and selected category
   */
  const filteredBooks = useMemo(() => {
    return state.books.filter(book => {
      // Category filter
      const matchesCategory = state.selectedCategory === 'All' || 
        (book.category && book.category.toLowerCase() === state.selectedCategory.toLowerCase());

      // Search filter (case-insensitive)
      const matchesSearch = 
        (book.title || '').toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (book.author || '').toLowerCase().includes(state.searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [state.books, state.selectedCategory, state.searchQuery]);

  /**
   * Group filtered books by category
   */
  const groupedBooks = useMemo(() => {
    return filteredBooks.reduce((acc, book) => {
      const category = book.category ? book.category.trim() : 'General';
      
      // Match with predefined categories (case-insensitive)
      const matchedCategory = BOOK_CATEGORIES.find(
        cat => cat.toLowerCase() === category.toLowerCase()
      ) || 'General';
      
      if (!acc[matchedCategory]) {
        acc[matchedCategory] = [];
      }
      acc[matchedCategory].push(book);
      return acc;
    }, {} as Record<string, Book[]>);
  }, [filteredBooks]);

  /**
   * Calculate book count by category for all books (not just filtered)
   */
  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Initialize all categories with 0
    BOOK_CATEGORIES.forEach(category => {
      counts[category] = 0;
    });
    
    // Count books by category (case-insensitive)
    state.books.forEach(book => {
      if (book.category) {
        const matchedCategory = BOOK_CATEGORIES.find(
          cat => cat.toLowerCase() === book.category?.toLowerCase()
        );
        if (matchedCategory) {
          counts[matchedCategory] = (counts[matchedCategory] || 0) + 1;
        }
      }
    });
    
    return counts;
  }, [state.books]);

  /**
   * Update state with derived values
   */
  useEffect(() => {
    setState(prev => ({
      ...prev,
      filteredBooks,
      groupedBooks,
      categoryCount,
    }));
  }, [filteredBooks, groupedBooks, categoryCount]);

  /**
   * Handle errors with user-friendly messages
   */
  const handleError = useCallback((error: unknown): string => {
    console.error('Books operation error:', error);

    if (error instanceof ValidationError) {
      return error.message;
    }
    
    if (error instanceof NetworkError) {
      return 'Connection problem. Please check your internet and try again.';
    }
    
    if (error instanceof ApiError) {
      return error.message;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }, []);

  /**
   * Fetch all books from API
   */
  const fetchBooks = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const books = await booksService.getAllBooks();
      setState(prev => ({
        ...prev,
        books,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = handleError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [handleError]);

  /**
   * Create a new book and automatically refresh data
   */
  const createBook = useCallback(async (bookData: CreateBookData): Promise<Book> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const newBook = await booksService.createBook(bookData);
      
      // Automatically refresh books after successful creation
      await refreshBooks();
      
      return newBook;
    } catch (error) {
      const errorMessage = handleError(error);
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error; // Re-throw for component handling
    }
  }, [handleError]);

  /**
   * Update an existing book and refresh data
   */
  const updateBook = useCallback(async (id: string, bookData: UpdateBookData): Promise<Book> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const updatedBook = await booksService.updateBook(id, bookData);
      
      // Refresh books after successful update
      await refreshBooks();
      
      return updatedBook;
    } catch (error) {
      const errorMessage = handleError(error);
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [handleError]);

  /**
   * Delete a book and refresh data
   */
  const deleteBook = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      await booksService.deleteBook(id);
      
      // Refresh books after successful deletion
      await refreshBooks();
    } catch (error) {
      const errorMessage = handleError(error);
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [handleError]);

  /**
   * Refresh books data (lightweight reload)
   */
  const refreshBooks = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, refreshing: true, error: null }));

    try {
      const books = await booksService.getAllBooks();
      setState(prev => ({
        ...prev,
        books,
        refreshing: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = handleError(error);
      setState(prev => ({
        ...prev,
        refreshing: false,
        error: errorMessage,
      }));
    }
  }, [handleError]);

  /**
   * Set search query and reset to first page if paginated
   */
  const setSearchQuery = useCallback((query: string): void => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  /**
   * Set selected category filter
   */
  const setSelectedCategory = useCallback((category: string): void => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  /**
   * Clear current error state
   */
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Initialize books on mount
   */
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    // State
    books: state.books,
    filteredBooks: state.filteredBooks,
    groupedBooks: state.groupedBooks,
    categoryCount: state.categoryCount,
    loading: state.loading,
    error: state.error,
    selectedCategory: state.selectedCategory,
    searchQuery: state.searchQuery,
    refreshing: state.refreshing,
    
    // Actions
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    refreshBooks,
    setSearchQuery,
    setSelectedCategory,
    clearError,
  };
}

export default useBooks;