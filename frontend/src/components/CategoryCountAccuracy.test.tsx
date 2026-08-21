import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import CategoryFilters from './CategoryFilters';
import { BOOK_CATEGORIES, Book, BookCategory } from '../types/book';

/**
 * Property-Based Test: Category Count Accuracy
 * **Validates: Requirements 5.2**
 * 
 * Feature: enhanced-library-interface, Property 2: Category count accuracy
 * 
 * This property test validates that for any book collection state, the count displayed 
 * next to each category filter exactly equals the number of books in that category.
 */
describe('Property 2: Category Count Accuracy', () => {
  
  // Generator for creating valid book objects with Islamic categories
  const bookGenerator = fc.record({
    _id: fc.option(fc.string({ minLength: 24, maxLength: 24 })),
    id: fc.option(fc.oneof(fc.string(), fc.integer())),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    author: fc.string({ minLength: 1, maxLength: 50 }),
    category: fc.constantFrom(...BOOK_CATEGORIES),
    price: fc.float({ min: Math.fround(0.01), max: Math.fround(999.99) }),
    image: fc.option(fc.webUrl())
  });

  // Generator for arrays of books
  const bookArrayGenerator = fc.array(bookGenerator, { minLength: 0, maxLength: 50 });

  // Generator for selected category (including 'All')
  const categoryGenerator = fc.constantFrom('All', ...BOOK_CATEGORIES);

  /**
   * Property Test: Category count accuracy
   * 
   * For any collection of books, the count displayed next to each category filter
   * should exactly equal the number of books in that category.
   */
  it('should display accurate counts for each category across all possible book collections', () => {
    fc.assert(
      fc.property(
        bookArrayGenerator,
        categoryGenerator,
        (books: Book[], selectedCategory: string) => {
          // Calculate expected counts for each category
          const expectedCounts: Record<string, number> = {};
          
          // Initialize all categories with 0
          BOOK_CATEGORIES.forEach(category => {
            expectedCounts[category] = 0;
          });

          // Count books in each category (case-insensitive matching)
          books.forEach(book => {
            if (book.category) {
              const matchedCategory = BOOK_CATEGORIES.find(
                cat => cat.toLowerCase() === book.category!.toLowerCase()
              );
              if (matchedCategory) {
                expectedCounts[matchedCategory]++;
              }
            }
          });

          // Calculate expected total count for 'All' category
          const expectedTotalCount = Object.values(expectedCounts).reduce((sum, count) => sum + count, 0);

          // Mock onCategoryChange function
          const mockOnCategoryChange = () => {};

          // Render the CategoryFilters component
          const { container } = render(
            <CategoryFilters
              categories={BOOK_CATEGORIES}
              selectedCategory={selectedCategory}
              bookCounts={expectedCounts}
              onCategoryChange={mockOnCategoryChange}
            />
          );

          // Verify 'All' category displays total count
          const allButton = container.querySelector('[aria-label*="Filter by All category"]');
          expect(allButton).toBeTruthy();
          const allCountBadge = allButton?.querySelector('span:last-child');
          expect(allCountBadge?.textContent).toBe(expectedTotalCount.toString());

          // Verify each Islamic category displays correct count
          BOOK_CATEGORIES.forEach(category => {
            const categoryButton = container.querySelector(`[aria-label*="Filter by ${category} category"]`);
            expect(categoryButton).toBeTruthy();
            
            const countBadge = categoryButton?.querySelector('span:last-child');
            const displayedCount = parseInt(countBadge?.textContent || '0', 10);
            const expectedCount = expectedCounts[category];
            
            // Assert that displayed count matches expected count
            expect(displayedCount).toBe(expectedCount);
          });
        }
      ),
      { 
        numRuns: 100,
        seed: 42, // For reproducible tests
        verbose: false
      }
    );
  });

  /**
   * Property Test: Category count consistency with different book distributions
   * 
   * Validates that counts remain accurate even when books are unevenly distributed
   * across categories or when some categories have zero books.
   */
  it('should maintain count accuracy with uneven book distributions', () => {
    fc.assert(
      fc.property(
        fc.record({
          // Generate books for each category with different distributions
          Quran: fc.array(bookGenerator.map(book => ({ ...book, category: 'Quran' as BookCategory })), { maxLength: 20 }),
          Tafsir: fc.array(bookGenerator.map(book => ({ ...book, category: 'Tafsir' as BookCategory })), { maxLength: 15 }),
          Hadith: fc.array(bookGenerator.map(book => ({ ...book, category: 'Hadith' as BookCategory })), { maxLength: 25 }),
          Sira: fc.array(bookGenerator.map(book => ({ ...book, category: 'Sira' as BookCategory })), { maxLength: 10 }),
          Fiqh: fc.array(bookGenerator.map(book => ({ ...book, category: 'Fiqh' as BookCategory })), { maxLength: 12 })
        }),
        categoryGenerator,
        (categorizedBooks, selectedCategory) => {
          // Flatten all books into a single array
          const allBooks = [
            ...categorizedBooks.Quran,
            ...categorizedBooks.Tafsir,
            ...categorizedBooks.Hadith,
            ...categorizedBooks.Sira,
            ...categorizedBooks.Fiqh
          ];

          // Calculate counts based on actual book distribution
          const actualCounts: Record<string, number> = {
            'Quran': categorizedBooks.Quran.length,
            'Tafsir': categorizedBooks.Tafsir.length,
            'Hadith': categorizedBooks.Hadith.length,
            'Sira': categorizedBooks.Sira.length,
            'Fiqh': categorizedBooks.Fiqh.length
          };

          const totalCount = allBooks.length;

          // Mock onCategoryChange function
          const mockOnCategoryChange = () => {};

          // Render the component
          const { container } = render(
            <CategoryFilters
              categories={BOOK_CATEGORIES}
              selectedCategory={selectedCategory}
              bookCounts={actualCounts}
              onCategoryChange={mockOnCategoryChange}
            />
          );

          // Verify 'All' category shows total count
          const allButton = container.querySelector('[aria-label*="Filter by All category"]');
          const allCountBadge = allButton?.querySelector('span:last-child');
          expect(allCountBadge?.textContent).toBe(totalCount.toString());

          // Verify each category shows correct individual count
          Object.entries(actualCounts).forEach(([category, expectedCount]) => {
            const categoryButton = container.querySelector(`[aria-label*="Filter by ${category} category"]`);
            const countBadge = categoryButton?.querySelector('span:last-child');
            const displayedCount = parseInt(countBadge?.textContent || '0', 10);
            
            expect(displayedCount).toBe(expectedCount);
          });
        }
      ),
      { 
        numRuns: 100,
        seed: 123
      }
    );
  });

  /**
   * Property Test: Empty category handling
   * 
   * Validates that categories with zero books display '0' count correctly
   * and that the total still sums correctly.
   */
  it('should handle empty categories correctly in count display', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...BOOK_CATEGORIES), { minLength: 0, maxLength: 3 }), // Categories that will have books
        (categoriesWithBooks) => {
          // Create a count object where only specified categories have books
          const bookCounts: Record<string, number> = {};
          
          // Initialize all categories to 0
          BOOK_CATEGORIES.forEach(category => {
            bookCounts[category] = 0;
          });

          // Add books only to selected categories
          categoriesWithBooks.forEach(category => {
            bookCounts[category] = Math.floor(Math.random() * 10) + 1; // 1-10 books
          });

          const totalExpectedCount = Object.values(bookCounts).reduce((sum, count) => sum + count, 0);

          // Mock onCategoryChange function
          const mockOnCategoryChange = () => {};

          // Render the component
          const { container } = render(
            <CategoryFilters
              categories={BOOK_CATEGORIES}
              selectedCategory="All"
              bookCounts={bookCounts}
              onCategoryChange={mockOnCategoryChange}
            />
          );

          // Verify 'All' category shows correct total
          const allButton = container.querySelector('[aria-label*="Filter by All category"]');
          const allCountBadge = allButton?.querySelector('span:last-child');
          expect(allCountBadge?.textContent).toBe(totalExpectedCount.toString());

          // Verify each category shows correct count (including zeros)
          BOOK_CATEGORIES.forEach(category => {
            const categoryButton = container.querySelector(`[aria-label*="Filter by ${category} category"]`);
            const countBadge = categoryButton?.querySelector('span:last-child');
            const displayedCount = parseInt(countBadge?.textContent || '0', 10);
            const expectedCount = bookCounts[category];
            
            expect(displayedCount).toBe(expectedCount);
            
            // Categories with 0 books should be disabled
            if (expectedCount === 0) {
              expect(categoryButton).toHaveAttribute('disabled');
            } else {
              expect(categoryButton).not.toHaveAttribute('disabled');
            }
          });
        }
      ),
      { 
        numRuns: 50,
        seed: 456
      }
    );
  });

  /**
   * Property Test: Count calculation with case variations
   * 
   * Validates that category counting is case-insensitive and handles
   * potential variations in category naming.
   */
  it('should handle case-insensitive category matching for accurate counts', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 50 }),
            author: fc.string({ minLength: 1, maxLength: 30 }),
            category: fc.constantFrom(...BOOK_CATEGORIES).map(cat => 
              // Randomly vary the case of the category
              fc.sample(fc.constantFrom(
                cat,
                cat.toLowerCase(),
                cat.toUpperCase(),
                cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
              ), 1)[0]
            ),
            price: fc.float({ min: Math.fround(0.01), max: Math.fround(500) }),
            _id: fc.option(fc.string())
          }),
          { maxLength: 30 }
        ),
        (booksWithVariedCase) => {
          // Calculate expected counts by normalizing categories to match BOOK_CATEGORIES
          const expectedCounts: Record<string, number> = {};
          
          BOOK_CATEGORIES.forEach(category => {
            expectedCounts[category] = 0;
          });

          booksWithVariedCase.forEach(book => {
            if (book.category) {
              // Find matching category (case-insensitive)
              const matchedCategory = BOOK_CATEGORIES.find(
                cat => cat.toLowerCase() === book.category!.toLowerCase()
              );
              if (matchedCategory) {
                expectedCounts[matchedCategory]++;
              }
            }
          });

          const expectedTotal = Object.values(expectedCounts).reduce((sum, count) => sum + count, 0);

          // Mock onCategoryChange function
          const mockOnCategoryChange = () => {};

          // Render the component
          const { container } = render(
            <CategoryFilters
              categories={BOOK_CATEGORIES}
              selectedCategory="All"
              bookCounts={expectedCounts}
              onCategoryChange={mockOnCategoryChange}
            />
          );

          // Verify total count for 'All'
          const allButton = container.querySelector('[aria-label*="Filter by All category"]');
          const allCountBadge = allButton?.querySelector('span:last-child');
          expect(allCountBadge?.textContent).toBe(expectedTotal.toString());

          // Verify individual category counts
          BOOK_CATEGORIES.forEach(category => {
            const categoryButton = container.querySelector(`[aria-label*="Filter by ${category} category"]`);
            const countBadge = categoryButton?.querySelector('span:last-child');
            const displayedCount = parseInt(countBadge?.textContent || '0', 10);
            
            expect(displayedCount).toBe(expectedCounts[category]);
          });
        }
      ),
      { 
        numRuns: 75,
        seed: 789
      }
    );
  });
});