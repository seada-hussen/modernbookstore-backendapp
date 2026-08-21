import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookshelfView from './BookshelfView';
import { Book, GroupedBooks } from '../types/book';

// Mock books data for testing
const mockBooks: Book[] = [
  {
    _id: '1',
    title: 'The Noble Quran',
    author: 'Abdullah Yusuf Ali',
    category: 'Quran',
    price: 25.99,
    image: 'https://example.com/quran.jpg'
  },
  {
    _id: '2',
    title: 'Tafsir Ibn Kathir',
    author: 'Ibn Kathir',
    category: 'Tafsir',
    price: 45.50,
  },
  {
    _id: '3',
    title: 'Sahih Bukhari',
    author: 'Imam Bukhari',
    category: 'Hadith',
    price: 35.00,
    image: 'https://example.com/bukhari.jpg'
  },
  {
    _id: '4',
    title: 'The Sealed Nectar',
    author: 'Safiur Rahman Mubarakpuri',
    category: 'Sira',
    price: 20.99,
  }
];

// Group books by category for testing
const mockGroupedBooks: GroupedBooks = {
  'Quran': [mockBooks[0]],
  'Tafsir': [mockBooks[1]],
  'Hadith': [mockBooks[2]],
  'Sira': [mockBooks[3]]
};

describe('BookshelfView Component', () => {
  it('should render books grouped by category', () => {
    render(<BookshelfView groupedBooks={mockGroupedBooks} />);
    
    // Check that category headers are displayed
    expect(screen.getByText('Quran')).toBeInTheDocument();
    expect(screen.getByText('Tafsir')).toBeInTheDocument();
    expect(screen.getByText('Hadith')).toBeInTheDocument();
    expect(screen.getByText('Sira')).toBeInTheDocument();
    
    // Check that book titles are displayed by finding h3 elements
    const bookTitles = screen.getAllByRole('heading', { level: 3 });
    const titleTexts = bookTitles.map(title => title.textContent);
    
    expect(titleTexts).toContain('The Noble Quran');
    expect(titleTexts).toContain('Tafsir Ibn Kathir');
    expect(titleTexts).toContain('Sahih Bukhari');
    expect(titleTexts).toContain('The Sealed Nectar');
  });

  it('should display book count for each category', () => {
    render(<BookshelfView groupedBooks={mockGroupedBooks} />);
    
    // Check that book counts are displayed correctly - use getAllByText since each category shows "1 book"
    const bookCounts = screen.getAllByText('1 book');
    expect(bookCounts).toHaveLength(4); // One for each category
  });

  it('should display "No books found" message when no books are provided', () => {
    render(<BookshelfView groupedBooks={{}} />);
    
    expect(screen.getByText('No books found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or category filter to find more books in your collection.')).toBeInTheDocument();
  });

  it('should handle books without images by showing title on amber background', () => {
    const booksWithoutImages: GroupedBooks = {
      'Tafsir': [mockBooks[1]] // This book has no image
    };
    
    render(<BookshelfView groupedBooks={booksWithoutImages} />);
    
    // Check that the amber background fallback is rendered
    const amberBackground = document.querySelector('.bg-amber-100');
    expect(amberBackground).toBeInTheDocument();
    
    // Check that the book title appears in the fallback area
    const titleInFallback = document.querySelector('.bg-amber-100 .text-amber-800');
    expect(titleInFallback).toHaveTextContent('Tafsir Ibn Kathir');
  });

  it('should call onOrderBook when Order Now button is clicked', () => {
    const mockOnOrderBook = vi.fn();
    
    render(<BookshelfView groupedBooks={mockGroupedBooks} onOrderBook={mockOnOrderBook} />);
    
    // Find and click the first "Order Now" button
    const orderButtons = screen.getAllByText('Order Now');
    fireEvent.click(orderButtons[0]);
    
    // Check that the callback was called with the book ID
    expect(mockOnOrderBook).toHaveBeenCalledWith('1');
  });

  it('should not display Order Now buttons when onOrderBook is not provided', () => {
    render(<BookshelfView groupedBooks={mockGroupedBooks} />);
    
    // Should not find any Order Now buttons
    expect(screen.queryByText('Order Now')).not.toBeInTheDocument();
  });

  it('should handle case-insensitive category matching', () => {
    const mixedCaseGroupedBooks: GroupedBooks = {
      'quran': [mockBooks[0]], // lowercase
      'TAFSIR': [mockBooks[1]], // uppercase  
      'Hadith': [mockBooks[2]], // proper case
    };
    
    render(<BookshelfView groupedBooks={mixedCaseGroupedBooks} />);
    
    // Should still display books properly regardless of case - check by role
    const bookTitles = screen.getAllByRole('heading', { level: 3 });
    const titleTexts = bookTitles.map(title => title.textContent);
    
    expect(titleTexts).toContain('The Noble Quran');
    expect(titleTexts).toContain('Tafsir Ibn Kathir');
    expect(titleTexts).toContain('Sahih Bukhari');
  });

  it('should display decorative shelf bottom for each category', () => {
    render(<BookshelfView groupedBooks={mockGroupedBooks} />);
    
    // Check that shelf decorations are present (by checking for the gradient classes)
    const shelfElements = document.querySelectorAll('.bg-gradient-to-r');
    expect(shelfElements.length).toBeGreaterThan(0);
  });

  it('should display book prices correctly formatted', () => {
    render(<BookshelfView groupedBooks={mockGroupedBooks} />);
    
    expect(screen.getByText('$25.99')).toBeInTheDocument();
    expect(screen.getByText('$45.50')).toBeInTheDocument();
    expect(screen.getByText('$35.00')).toBeInTheDocument();
    expect(screen.getByText('$20.99')).toBeInTheDocument();
  });

  it('should maintain Islamic category ordering', () => {
    render(<BookshelfView groupedBooks={mockGroupedBooks} />);
    
    // Get all category headers in document order
    const categoryHeaders = screen.getAllByRole('heading', { level: 2 });
    const categoryTexts = categoryHeaders.map(header => header.textContent);
    
    // Should maintain the order: Quran, Tafsir, Hadith, Sira, Fiqh (for existing categories)
    const quranIndex = categoryTexts.indexOf('Quran');
    const tafsirIndex = categoryTexts.indexOf('Tafsir');
    const hadithIndex = categoryTexts.indexOf('Hadith');
    const siraIndex = categoryTexts.indexOf('Sira');
    
    expect(quranIndex).toBeLessThan(tafsirIndex);
    expect(tafsirIndex).toBeLessThan(hadithIndex);
    expect(hadithIndex).toBeLessThan(siraIndex);
  });
});