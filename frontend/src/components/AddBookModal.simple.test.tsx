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

describe('AddBookModal - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal when isOpen is true', () => {
    render(<AddBookModal {...mockProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<AddBookModal {...mockProps} />);
    
    expect(screen.getByLabelText(/book title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover image url/i)).toBeInTheDocument();
  });

  it('should call onSubmit with valid data', async () => {
    const user = userEvent.setup();
    render(<AddBookModal {...mockProps} />);
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/book title/i), 'Test Book');
    await user.type(screen.getByLabelText(/author/i), 'Test Author');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Tafsir');
    await user.type(screen.getByLabelText(/price/i), '29.99');
    
    await user.click(screen.getByRole('button', { name: /add book/i }));
    
    expect(mockProps.onSubmit).toHaveBeenCalledWith({
      title: 'Test Book',
      author: 'Test Author',
      category: 'Tafsir',
      price: 29.99,
      image: undefined
    });
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddBookModal {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should validate required fields and show errors', async () => {
    const user = userEvent.setup();
    render(<AddBookModal {...mockProps} />);
    
    // Submit empty form
    await user.click(screen.getByRole('button', { name: /add book/i }));
    
    // Wait for validation errors to appear
    await waitFor(() => {
      // Look for the specific error messages that should appear
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Author is required')).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should update form values when user types', async () => {
    const user = userEvent.setup();
    render(<AddBookModal {...mockProps} />);
    
    const titleInput = screen.getByLabelText(/book title/i);
    const authorInput = screen.getByLabelText(/author/i);
    
    await user.type(titleInput, 'My Test Book');
    await user.type(authorInput, 'Test Author Name');
    
    expect(titleInput).toHaveValue('My Test Book');
    expect(authorInput).toHaveValue('Test Author Name');
  });

  it('should close when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddBookModal {...mockProps} />);
    
    await user.click(screen.getByLabelText(/close modal/i));
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});