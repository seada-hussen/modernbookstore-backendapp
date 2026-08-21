import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddBookModal from './AddBookModal';
import { BOOK_CATEGORIES } from '../types/book';

// Mock props
const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  categories: BOOK_CATEGORIES
};

describe('AddBookModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<AddBookModal {...mockProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Add New Book')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<AddBookModal {...mockProps} isOpen={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render all form fields with proper labels', () => {
      render(<AddBookModal {...mockProps} />);
      
      expect(screen.getByLabelText(/book title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cover image url/i)).toBeInTheDocument();
    });

    it('should render category dropdown with all Islamic categories', () => {
      render(<AddBookModal {...mockProps} />);
      
      const categorySelect = screen.getByLabelText(/category/i);
      BOOK_CATEGORIES.forEach(category => {
        expect(screen.getByRole('option', { name: category })).toBeInTheDocument();
      });
      
      // Should default to first category (Quran)
      expect(categorySelect).toHaveValue('Quran');
    });

    it('should render action buttons', () => {
      render(<AddBookModal {...mockProps} />);
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument();
    });

    it('should render close button in header', () => {
      render(<AddBookModal {...mockProps} />);
      
      expect(screen.getByLabelText(/close modal/i)).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('should focus title input when modal opens', async () => {
      render(<AddBookModal {...mockProps} />);
      
      const titleInput = screen.getByLabelText(/book title/i);
      await waitFor(() => {
        expect(titleInput).toHaveFocus();
      });
    });

    it('should update form fields when user types', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const titleInput = screen.getByLabelText(/book title/i);
      const authorInput = screen.getByLabelText(/author/i);
      const priceInput = screen.getByLabelText(/price/i);
      const imageInput = screen.getByLabelText(/cover image url/i);
      
      await user.type(titleInput, 'Test Book Title');
      await user.type(authorInput, 'Test Author');
      await user.type(priceInput, '25.99');
      await user.type(imageInput, 'https://example.com/image.jpg');
      
      expect(titleInput).toHaveValue('Test Book Title');
      expect(authorInput).toHaveValue('Test Author');
      expect(priceInput).toHaveValue(25.99);
      expect(imageInput).toHaveValue('https://example.com/image.jpg');
    });

    it('should change category when dropdown selection changes', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const categorySelect = screen.getByLabelText(/category/i);
      await user.selectOptions(categorySelect, 'Hadith');
      
      expect(categorySelect).toHaveValue('Hadith');
    });

    it('should reset form when modal opens', () => {
      const { rerender } = render(<AddBookModal {...mockProps} isOpen={false} />);
      
      // Open modal and fill form
      rerender(<AddBookModal {...mockProps} isOpen={true} />);
      const titleInput = screen.getByLabelText(/book title/i);
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      
      // Close and reopen modal
      rerender(<AddBookModal {...mockProps} isOpen={false} />);
      rerender(<AddBookModal {...mockProps} isOpen={true} />);
      
      expect(screen.getByLabelText(/book title/i)).toHaveValue('');
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty required fields', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add book/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Author is required')).toBeInTheDocument();
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for title exceeding 200 characters', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const titleInput = screen.getByLabelText(/book title/i);
      const longTitle = 'a'.repeat(201);
      
      await user.type(titleInput, longTitle);
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      expect(screen.getByText('Title must be 200 characters or less')).toBeInTheDocument();
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for author exceeding 100 characters', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const authorInput = screen.getByLabelText(/author/i);
      const longAuthor = 'a'.repeat(101);
      
      await user.type(authorInput, longAuthor);
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      expect(screen.getByText('Author must be 100 characters or less')).toBeInTheDocument();
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for negative price', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const priceInput = screen.getByLabelText(/price/i);
      
      await user.type(priceInput, '-5');
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      expect(screen.getByText('Price must be 0 or greater')).toBeInTheDocument();
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for price exceeding $9,999.99', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const priceInput = screen.getByLabelText(/price/i);
      
      await user.type(priceInput, '10000');
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      expect(screen.getByText('Price must be $9,999.99 or less')).toBeInTheDocument();
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for invalid image URL', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const imageInput = screen.getByLabelText(/cover image url/i);
      
      await user.type(imageInput, 'invalid-url');
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      expect(screen.getByText(/Please enter a valid URL starting with http:\/\/ or https:\/\//i)).toBeInTheDocument();
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });

    it('should clear validation errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      // Trigger validation error by submitting empty form
      const submitButton = screen.getByRole('button', { name: /add book/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
      
      // Start typing to clear error
      const titleInput = screen.getByLabelText(/book title/i);
      await user.type(titleInput, 'T');
      
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });

    it('should accept valid image URL', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      const imageInput = screen.getByLabelText(/cover image url/i);
      
      await user.type(imageInput, 'https://example.com/image.jpg');
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      // Should not show URL validation error (other required field errors may show)
      expect(screen.queryByText(/Please enter a valid URL starting with http:\/\/ or https:\/\//i)).not.toBeInTheDocument();
    });

    it('should allow empty optional image URL field', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      // Fill required fields
      await user.type(screen.getByLabelText(/book title/i), 'Test Book');
      await user.type(screen.getByLabelText(/author/i), 'Test Author');
      await user.type(screen.getByLabelText(/price/i), '25');
      
      // Leave image URL empty and submit
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'Test Book',
        author: 'Test Author',
        category: 'Quran', // Default category
        price: 25,
        image: undefined
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      // Fill form with valid data
      await user.type(screen.getByLabelText(/book title/i), 'Tafsir Ibn Kathir');
      await user.type(screen.getByLabelText(/author/i), 'Ibn Kathir');
      await user.selectOptions(screen.getByLabelText(/category/i), 'Tafsir');
      await user.type(screen.getByLabelText(/price/i), '29.99');
      await user.type(screen.getByLabelText(/cover image url/i), 'https://example.com/book.jpg');
      
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'Tafsir Ibn Kathir',
        author: 'Ibn Kathir',
        category: 'Tafsir',
        price: 29.99,
        image: 'https://example.com/book.jpg'
      });
    });

    it('should trim whitespace from string fields', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      await user.type(screen.getByLabelText(/book title/i), '  Test Book  ');
      await user.type(screen.getByLabelText(/author/i), '  Test Author  ');
      await user.type(screen.getByLabelText(/price/i), '25');
      
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'Test Book',
        author: 'Test Author',
        category: 'Quran',
        price: 25,
        image: undefined
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      // Mock a delayed submission
      const delayedSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddBookModal {...mockProps} onSubmit={delayedSubmit} />);
      
      // Fill form and submit
      await user.type(screen.getByLabelText(/book title/i), 'Test Book');
      await user.type(screen.getByLabelText(/author/i), 'Test Author');
      await user.type(screen.getByLabelText(/price/i), '25');
      
      const submitButton = screen.getByRole('button', { name: /add book/i });
      await user.click(submitButton);
      
      // Should show loading state
      expect(screen.getByText('Adding...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });

    it('should handle submission errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const failingSubmit = vi.fn().mockRejectedValue(new Error('API Error'));
      
      render(<AddBookModal {...mockProps} onSubmit={failingSubmit} />);
      
      // Fill form and submit
      await user.type(screen.getByLabelText(/book title/i), 'Test Book');
      await user.type(screen.getByLabelText(/author/i), 'Test Author');
      await user.type(screen.getByLabelText(/price/i), '25');
      
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to submit book:', expect.any(Error));
      });
      
      // Form should remain open and interactive
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add book/i })).not.toBeDisabled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Modal Interaction', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when close button in header is clicked', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      await user.click(screen.getByLabelText(/close modal/i));
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      // Click on the backdrop (the outer div)
      const modal = screen.getByRole('dialog');
      const backdrop = modal.parentElement;
      
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockProps.onClose).toHaveBeenCalled();
      }
    });

    it('should not close when clicking inside modal content', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      // Click on the modal content (not the backdrop)
      const modalContent = screen.getByRole('dialog').firstChild as HTMLElement;
      await user.click(modalContent);
      
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    it('should close when Escape key is pressed', () => {
      render(<AddBookModal {...mockProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should prevent body scroll when modal is open', () => {
      // Store initial state
      const initialOverflow = document.body.style.overflow;
      
      const { rerender } = render(<AddBookModal {...mockProps} isOpen={false} />);
      
      // Modal closed - should not affect body scroll
      expect(document.body.style.overflow).toBe(initialOverflow);
      
      // Open modal - should prevent body scroll
      rerender(<AddBookModal {...mockProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe('hidden');
      
      // Close modal - should restore body scroll
      rerender(<AddBookModal {...mockProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<AddBookModal {...mockProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      
      expect(screen.getByText('Add New Book')).toHaveAttribute('id', 'modal-title');
    });

    it('should associate labels with form controls', () => {
      render(<AddBookModal {...mockProps} />);
      
      expect(screen.getByLabelText(/book title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cover image url/i)).toBeInTheDocument();
    });

    it('should mark required fields properly', () => {
      render(<AddBookModal {...mockProps} />);
      
      expect(screen.getByLabelText(/book title/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/author/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/category/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/price/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/cover image url/i)).not.toHaveAttribute('required');
    });

    it('should announce validation errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<AddBookModal {...mockProps} />);
      
      await user.click(screen.getByRole('button', { name: /add book/i }));
      
      // Wait for validation errors to appear
      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);
        errorMessages.forEach(error => {
          expect(error).toBeInTheDocument();
        });
      });
    });
  });
});