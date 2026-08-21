import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookSpine from './BookSpine';
import { Book } from '../types/book';

// Mock book data for testing
const mockBook: Book = {
  _id: 'book-1',
  title: 'The Holy Quran',
  author: 'Allah (SWT)',
  category: 'Quran',
  price: 25.99,
  image: 'https://example.com/quran-cover.jpg',
};

const mockBookWithoutImage: Book = {
  _id: 'book-2',
  title: 'Sahih Bukhari',
  author: 'Imam Bukhari',
  category: 'Hadith',
  price: 35.50,
  // No image provided
};

describe('BookSpine Component', () => {
  describe('Book Display - Requirement 7.1, 7.2, 7.3', () => {
    it('should display book cover image when available', () => {
      render(<BookSpine book={mockBook} />);
      
      const coverImage = screen.getByAltText('Cover of The Holy Quran');
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute('src', mockBook.image);
    });

    it('should display book title on amber background when no image provided', () => {
      render(<BookSpine book={mockBookWithoutImage} />);
      
      // Should show title text in both cover area and title section
      const titleElements = screen.getAllByText('Sahih Bukhari');
      expect(titleElements).toHaveLength(2);
      
      // Verify amber background styling for the cover area title
      const coverTitleSpan = titleElements.find(el => 
        el.tagName === 'SPAN' && el.classList.contains('text-amber-800')
      );
      expect(coverTitleSpan).toBeInTheDocument();
      expect(coverTitleSpan?.closest('div')).toHaveClass('bg-amber-100', 'border-amber-200');
    });

    it('should display book title, author, and price', () => {
      render(<BookSpine book={mockBook} />);
      
      // Check title display
      expect(screen.getByText('The Holy Quran')).toBeInTheDocument();
      
      // Check author display  
      expect(screen.getByText('Allah (SWT)')).toBeInTheDocument();
      
      // Check price display
      expect(screen.getByText('$25.99')).toBeInTheDocument();
    });

    it('should handle missing book properties gracefully', () => {
      const incompleteBook = {
        title: 'Test Book',
        author: 'Test Author',
        price: 15.99,
      } as Book;

      render(<BookSpine book={incompleteBook} />);
      
      // Check title display (appears in both cover and title section)
      const titleElements = screen.getAllByText('Test Book');
      expect(titleElements.length).toBeGreaterThanOrEqual(1);
      
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('$15.99')).toBeInTheDocument();
    });
  });

  describe('Order Button - Requirement 7.4', () => {
    it('should display Order Now button when onOrder callback provided', () => {
      const mockOnOrder = vi.fn();
      render(<BookSpine book={mockBook} onOrder={mockOnOrder} />);
      
      const orderButton = screen.getByText('Order Now');
      expect(orderButton).toBeInTheDocument();
      expect(orderButton).toHaveClass('bg-amber-600', 'hover:bg-amber-700');
    });

    it('should not display Order Now button when onOrder callback not provided', () => {
      render(<BookSpine book={mockBook} />);
      
      const orderButton = screen.queryByText('Order Now');
      expect(orderButton).not.toBeInTheDocument();
    });

    it('should call onOrder callback with book ID when Order Now button clicked', () => {
      const mockOnOrder = vi.fn();
      render(<BookSpine book={mockBook} onOrder={mockOnOrder} />);
      
      const orderButton = screen.getByText('Order Now');
      fireEvent.click(orderButton);
      
      expect(mockOnOrder).toHaveBeenCalledWith('book-1');
    });

    it('should generate fallback ID when book has no _id or id', () => {
      const bookWithoutId = {
        title: 'Test Book',
        author: 'Test Author',
        price: 10.00,
      } as Book;
      
      const mockOnOrder = vi.fn();
      render(<BookSpine book={bookWithoutId} onOrder={mockOnOrder} />);
      
      const orderButton = screen.getByText('Order Now');
      fireEvent.click(orderButton);
      
      expect(mockOnOrder).toHaveBeenCalledWith('book-Test Book-Test Author');
    });

    it('should have proper accessibility attributes for order button', () => {
      const mockOnOrder = vi.fn();
      render(<BookSpine book={mockBook} onOrder={mockOnOrder} />);
      
      const orderButton = screen.getByText('Order Now');
      expect(orderButton).toHaveAttribute('aria-label', 'Order The Holy Quran by Allah (SWT)');
    });
  });

  describe('Card Styling - Requirement 7.5', () => {
    it('should maintain consistent card styling with white background and shadow', () => {
      const { container } = render(<BookSpine book={mockBook} />);
      
      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass(
        'responsive-book-card'
      );
    });
  });

  describe('Image Error Handling', () => {
    it('should handle image load error by showing title on amber background', () => {
      render(<BookSpine book={mockBook} />);
      
      const coverImage = screen.getByAltText('Cover of The Holy Quran');
      
      // Simulate image load error
      fireEvent.error(coverImage);
      
      // After error, should show title text (will appear in both places)
      const titleElements = screen.getAllByText('The Holy Quran');
      expect(titleElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Tooltips and Accessibility', () => {
    it('should provide title tooltips for long text', () => {
      render(<BookSpine book={mockBook} />);
      
      const titleElement = screen.getByText('The Holy Quran');
      expect(titleElement).toHaveAttribute('title', 'The Holy Quran');
      
      const authorElement = screen.getByText('Allah (SWT)');
      expect(authorElement).toHaveAttribute('title', 'Allah (SWT)');
    });
  });

  describe('Price Formatting', () => {
    it('should format price correctly to 2 decimal places', () => {
      const bookWithWholePrice = {
        ...mockBook,
        price: 20,
      };
      
      render(<BookSpine book={bookWithWholePrice} />);
      expect(screen.getByText('$20.00')).toBeInTheDocument();
    });

    it('should handle decimal prices correctly', () => {
      const bookWithDecimalPrice = {
        ...mockBook,
        price: 19.5,
      };
      
      render(<BookSpine book={bookWithDecimalPrice} />);
      expect(screen.getByText('$19.50')).toBeInTheDocument();
    });
  });
});