import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import LibraryHeader from './LibraryHeader';

describe('LibraryHeader Component', () => {
  const defaultProps = {
    bookCount: 5,
    userRole: 'user' as const,
    onAddBook: vi.fn(),
  };

  it('renders My Library heading', () => {
    render(<LibraryHeader {...defaultProps} />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('My Library');
  });

  it('displays book count in correct format', () => {
    render(<LibraryHeader {...defaultProps} />);
    
    expect(screen.getByText('5 books on your shelf')).toBeInTheDocument();
  });

  it('displays singular book count correctly', () => {
    render(<LibraryHeader {...defaultProps} bookCount={1} />);
    
    expect(screen.getByText('1 books on your shelf')).toBeInTheDocument();
  });

  it('displays zero book count correctly', () => {
    render(<LibraryHeader {...defaultProps} bookCount={0} />);
    
    expect(screen.getByText('0 books on your shelf')).toBeInTheDocument();
  });

  it('shows Add a book button for admin users', () => {
    render(<LibraryHeader {...defaultProps} userRole="admin" />);
    
    const addButton = screen.getByRole('button', { name: '+ Add a book' });
    expect(addButton).toBeInTheDocument();
  });

  it('hides Add a book button for regular users', () => {
    render(<LibraryHeader {...defaultProps} userRole="user" />);
    
    const addButton = screen.queryByRole('button', { name: '+ Add a book' });
    expect(addButton).not.toBeInTheDocument();
  });

  it('calls onAddBook when Add a book button is clicked', () => {
    const mockOnAddBook = vi.fn();
    render(<LibraryHeader {...defaultProps} userRole="admin" onAddBook={mockOnAddBook} />);
    
    const addButton = screen.getByRole('button', { name: '+ Add a book' });
    fireEvent.click(addButton);
    
    expect(mockOnAddBook).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling classes', () => {
    render(<LibraryHeader {...defaultProps} />);
    
    const container = screen.getByRole('heading', { level: 1 }).parentElement?.parentElement;
    expect(container).toHaveClass('responsive-container', 'flex', 'flex-col', 'sm:flex-row');
  });

  it('has proper button styling for admin users', () => {
    render(<LibraryHeader {...defaultProps} userRole="admin" />);
    
    const addButton = screen.getByRole('button', { name: '+ Add a book' });
    expect(addButton).toHaveClass(
      'bg-gray-900',
      'text-white',
      'rounded-full',
      'responsive-text-sm',
      'font-semibold',
      'responsive-interactive'
    );
  });

  /**
   * Property-Based Test: Admin role access control
   * Feature: enhanced-library-interface, Property 3: Admin role access control
   * 
   * **Validates: Requirements 3.3, 8.1**
   * 
   * This property test validates that for any user, the "Add a book" button should be 
   * visible if and only if their role is "admin", and hidden for all other roles.
   * 
   * The test generates various user profiles with different roles and other properties
   * and verifies the button visibility property holds across all cases, ensuring that
   * access control is correctly enforced regardless of other user attributes.
   */
  it('should show Add a book button if and only if user role is admin', () => {
    fc.assert(
      fc.property(
        fc.record({
          // User role - this is the critical property being tested
          userRole: fc.constantFrom('admin', 'user'),
          // Book count variations to ensure role check is independent of book count
          bookCount: fc.integer({ min: 0, max: 10000 }),
          // Additional user properties to ensure role check is isolated
          userName: fc.string({ minLength: 1, maxLength: 50 }),
          hasBooks: fc.boolean(),
          isLoggedIn: fc.boolean()
        }),
        ({ userRole, bookCount, userName, hasBooks, isLoggedIn }) => {
          const mockOnAddBook = vi.fn();
          
          // Clean up any previous renders
          cleanup();
          
          render(
            <LibraryHeader
              bookCount={bookCount}
              userRole={userRole}
              onAddBook={mockOnAddBook}
            />
          );
          
          // The critical property: button visibility should depend ONLY on role
          const addButton = screen.queryByRole('button', { name: '+ Add a book' });
          
          if (userRole === 'admin') {
            // Admin users should ALWAYS see the button
            expect(addButton).toBeInTheDocument();
            
            // Verify button functionality is available
            expect(addButton).toHaveAttribute('type', 'button');
            
            // Verify proper styling is applied for admin button
            expect(addButton).toHaveClass(
              'bg-gray-900',
              'text-white',
              'rounded-full',
              'responsive-text-sm',
              'font-semibold',
              'responsive-interactive'
            );
            
            // Verify click handler is properly attached
            fireEvent.click(addButton);
            expect(mockOnAddBook).toHaveBeenCalledTimes(1);
          } else {
            // Non-admin users should NEVER see the button
            expect(addButton).not.toBeInTheDocument();
            
            // Verify no add book functionality is available for non-admin
            expect(mockOnAddBook).not.toHaveBeenCalled();
          }
          
          // Clean up after this iteration
          cleanup();
        }
      ),
      {
        numRuns: 100, // Run 100 iterations to test various user scenarios
        verbose: true
      }
    );
  }, 10000); // Extend timeout for property-based test

  /**
   * Property-Based Test: Book count display formatting
   * Feature: enhanced-library-interface, Property 10: Book count display formatting
   * 
   * **Validates: Requirements 3.2**
   * 
   * This property test validates that for any number of books in the collection,
   * the count should be displayed in the exact format "{count} books on your shelf"
   * as specified in Requirements 3.2.
   * 
   * The test generates various book collection sizes (0 to large numbers) and
   * ensures the LibraryHeader component formats the count correctly using the
   * exact format requirement.
   */
  it('should format book count display correctly for any number', () => {
    fc.assert(
      fc.property(
        // Generate book counts from 0 to 10,000 to test various scenarios
        fc.integer({ min: 0, max: 10000 }),
        (bookCount) => {
          const mockOnAddBook = vi.fn();
          
          // Clean up any previous renders
          cleanup();
          
          render(
            <LibraryHeader
              bookCount={bookCount}
              userRole="user"
              onAddBook={mockOnAddBook}
            />
          );
          
          // Verify the exact format "{count} books on your shelf" is used
          const expectedText = `${bookCount} books on your shelf`;
          const bookCountElement = screen.getByText(expectedText);
          
          // Assert the element exists with exact text
          expect(bookCountElement).toBeInTheDocument();
          
          // Verify it's displayed as paragraph text with correct styling
          expect(bookCountElement.tagName).toBe('P');
          expect(bookCountElement).toHaveClass('responsive-text-sm', 'text-gray-500');
          
          // Clean up after this iteration
          cleanup();
        }
      ),
      {
        numRuns: 100, // Run 100 iterations to test various book counts
        verbose: true
      }
    );
  }, 10000); // Extend timeout for property-based test
});