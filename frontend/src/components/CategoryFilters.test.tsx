import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CategoryFilters from './CategoryFilters';
import { BOOK_CATEGORIES } from '../types/book';

describe('CategoryFilters Component', () => {
  const mockOnCategoryChange = vi.fn();
  
  const defaultProps = {
    categories: BOOK_CATEGORIES,
    selectedCategory: 'All',
    bookCounts: {
      'Quran': 5,
      'Tafsir': 3,
      'Hadith': 4,
      'Sira': 2,
      'Fiqh': 1
    },
    onCategoryChange: mockOnCategoryChange
  };

  beforeEach(() => {
    mockOnCategoryChange.mockClear();
  });

  it('should render all category filter buttons including "All"', () => {
    render(<CategoryFilters {...defaultProps} />);

    // Should render "All" button
    expect(screen.getByRole('button', { name: /Filter by All category/i })).toBeInTheDocument();
    
    // Should render all Islamic category buttons
    BOOK_CATEGORIES.forEach(category => {
      expect(screen.getByRole('button', { name: new RegExp(`Filter by ${category} category`, 'i') })).toBeInTheDocument();
    });
  });

  it('should display book counts next to category names', () => {
    render(<CategoryFilters {...defaultProps} />);

    // Check that book counts are displayed - should show calculated total of 15 for All
    expect(screen.getByText('15')).toBeInTheDocument(); // All books count (5+3+4+2+1)
    expect(screen.getByText('5')).toBeInTheDocument();  // Quran count
    expect(screen.getByText('3')).toBeInTheDocument();  // Tafsir count
    expect(screen.getByText('4')).toBeInTheDocument();  // Hadith count
    expect(screen.getByText('2')).toBeInTheDocument();  // Sira count
    expect(screen.getByText('1')).toBeInTheDocument();  // Fiqh count
  });

  it('should highlight the active filter with amber styling', () => {
    render(<CategoryFilters {...defaultProps} selectedCategory="Quran" />);

    const quranButton = screen.getByRole('button', { name: /Filter by Quran category/i });
    const allButton = screen.getByRole('button', { name: /Filter by All category/i });

    // Active button should have amber styling
    expect(quranButton).toHaveClass('bg-amber-50', 'border-amber-200', 'text-amber-800');
    expect(quranButton).toHaveAttribute('aria-pressed', 'true');

    // Non-active button should not have amber styling
    expect(allButton).not.toHaveClass('bg-amber-50');
    expect(allButton).toHaveClass('bg-white', 'text-gray-700');
    expect(allButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('should call onCategoryChange when a filter button is clicked', () => {
    render(<CategoryFilters {...defaultProps} />);

    const tafsirButton = screen.getByRole('button', { name: /Filter by Tafsir category/i });
    fireEvent.click(tafsirButton);

    expect(mockOnCategoryChange).toHaveBeenCalledWith('Tafsir');
  });

  it('should handle zero book counts correctly', () => {
    const propsWithZeroCounts = {
      ...defaultProps,
      bookCounts: {
        'Quran': 3,
        'Tafsir': 0,
        'Hadith': 0,
        'Sira': 0,
        'Fiqh': 0
      }
    };

    render(<CategoryFilters {...propsWithZeroCounts} />);

    // Buttons with zero count should be disabled
    const tafsirButton = screen.getByRole('button', { name: /Filter by Tafsir category/i });
    expect(tafsirButton).toBeDisabled();
    expect(tafsirButton).toHaveClass('opacity-50', 'cursor-not-allowed');

    // Button with books should not be disabled
    const quranButton = screen.getByRole('button', { name: /Filter by Quran category/i });
    expect(quranButton).not.toBeDisabled();
  });

  it('should display active filter indicator when a specific category is selected', () => {
    render(<CategoryFilters {...defaultProps} selectedCategory="Hadith" />);

    expect(screen.getByText('Currently viewing:')).toBeInTheDocument();
    // Find the specific span that shows the selected category in the active filter indicator
    const activeFilterText = screen.getByText('Currently viewing:').closest('div')?.querySelector('.text-amber-700');
    expect(activeFilterText).toHaveTextContent('Hadith');
    expect(screen.getByText('(4 books)')).toBeInTheDocument();
  });

  it('should not display active filter indicator when "All" is selected', () => {
    render(<CategoryFilters {...defaultProps} selectedCategory="All" />);

    expect(screen.queryByText('Currently viewing:')).not.toBeInTheDocument();
  });

  it('should allow clearing filter by clicking "View all categories" link', () => {
    render(<CategoryFilters {...defaultProps} selectedCategory="Fiqh" />);

    const viewAllLink = screen.getByText('View all categories');
    fireEvent.click(viewAllLink);

    expect(mockOnCategoryChange).toHaveBeenCalledWith('All');
  });

  it('should display empty state when no books are available', () => {
    const emptyProps = {
      ...defaultProps,
      bookCounts: {
        'Quran': 0,
        'Tafsir': 0,
        'Hadith': 0,
        'Sira': 0,
        'Fiqh': 0
      }
    };

    render(<CategoryFilters {...emptyProps} />);

    expect(screen.getByText('No books available in any category')).toBeInTheDocument();
  });

  it('should calculate total book count correctly for "All" category', () => {
    const testBookCounts = {
      'Quran': 10,
      'Tafsir': 5,
      'Hadith': 8,
      'Sira': 3,
      'Fiqh': 4
    };

    const propsWithoutTotal = {
      ...defaultProps,
      bookCounts: testBookCounts
    };

    render(<CategoryFilters {...propsWithoutTotal} />);

    // Total should be 10 + 5 + 8 + 3 + 4 = 30
    const allButton = screen.getByRole('button', { name: /Filter by All category/i });
    expect(allButton).toHaveTextContent('30');
  });

  it('should have proper accessibility attributes', () => {
    render(<CategoryFilters {...defaultProps} />);

    // Check aria-labels for screen readers
    const quranButton = screen.getByRole('button', { name: /Filter by Quran category, 5 books available/i });
    expect(quranButton).toHaveAttribute('aria-pressed');
    expect(quranButton).toHaveAttribute('aria-label');
  });

  it('should maintain responsive grid layout classes', () => {
    const { container } = render(<CategoryFilters {...defaultProps} />);

    // Check for responsive grid classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-2', 'sm:grid-cols-3', 'lg:grid-cols-6');
  });

  it('should render filter header with proper text', () => {
    render(<CategoryFilters {...defaultProps} />);

    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
    expect(screen.getByText('Browse books by Islamic categories or view all books')).toBeInTheDocument();
  });

  it('should handle missing category counts gracefully', () => {
    const incompleteProps = {
      ...defaultProps,
      bookCounts: {
        'Quran': 5,
        'Tafsir': 3
        // Missing other categories
      }
    };

    render(<CategoryFilters {...incompleteProps} />);

    // Missing categories should show 0 count
    const hadithButton = screen.getByRole('button', { name: /Filter by Hadith category/i });
    expect(hadithButton).toHaveTextContent('0');
    expect(hadithButton).toBeDisabled();
  });

  it('should handle keyboard navigation properly', () => {
    render(<CategoryFilters {...defaultProps} />);

    const firstButton = screen.getByRole('button', { name: /Filter by All category/i });
    
    // Should be focusable
    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    // Should have focus outline classes
    expect(firstButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-amber-500');
  });
});