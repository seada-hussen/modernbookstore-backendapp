import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchSystem from './SearchSystem';
import { UI_CONSTANTS } from '../utils/constants';

describe('SearchSystem Component', () => {
  const mockOnSearchChange = vi.fn();

  beforeEach(() => {
    mockOnSearchChange.mockClear();
  });

  it('should render with default placeholder text', () => {
    render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(UI_CONSTANTS.SEARCH_PLACEHOLDER);
    expect(searchInput).toBeInTheDocument();
  });

  it('should render with custom placeholder text', () => {
    const customPlaceholder = 'Custom search placeholder';
    render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        placeholder={customPlaceholder}
      />
    );

    const searchInput = screen.getByPlaceholderText(customPlaceholder);
    expect(searchInput).toBeInTheDocument();
  });

  it('should display the current search query in the input', () => {
    const searchQuery = 'test query';
    render(
      <SearchSystem 
        searchQuery={searchQuery}
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByDisplayValue(searchQuery);
    expect(searchInput).toBeInTheDocument();
  });

  it('should call onSearchChange when input value changes', () => {
    render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(UI_CONSTANTS.SEARCH_PLACEHOLDER);
    fireEvent.change(searchInput, { target: { value: 'new search' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('new search');
  });

  it('should show clear button when search query is not empty', () => {
    render(
      <SearchSystem 
        searchQuery="test"
        onSearchChange={mockOnSearchChange}
      />
    );

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when search query is empty', () => {
    render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear search when clear button is clicked', () => {
    render(
      <SearchSystem 
        searchQuery="test query"
        onSearchChange={mockOnSearchChange}
      />
    );

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });

  it('should display search results indicator when search query exists', () => {
    const searchQuery = 'islamic books';
    render(
      <SearchSystem 
        searchQuery={searchQuery}
        onSearchChange={mockOnSearchChange}
      />
    );

    expect(screen.getByText('Searching for: "')).toBeInTheDocument();
    expect(screen.getByText(searchQuery)).toBeInTheDocument();
    expect(screen.getByText('"')).toBeInTheDocument();
  });

  it('should not display search results indicator when search query is empty', () => {
    render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    expect(screen.queryByText('Searching for: "')).not.toBeInTheDocument();
  });

  it('should have proper styling classes for accessibility and design', () => {
    render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(UI_CONSTANTS.SEARCH_PLACEHOLDER);
    
    // Check for required styling classes
    expect(searchInput).toHaveClass('w-full');
    expect(searchInput).toHaveClass('rounded-lg');
    expect(searchInput).toHaveClass('focus:ring-amber-500'); // Amber focus ring requirement
  });

  it('should render search icon', () => {
    const { container } = render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    // Check for search icon SVG - it has the search path
    const searchIcon = container.querySelector('svg path[d*="21l-6-6m2-5a7"]');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should handle real-time input changes correctly', () => {
    render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(UI_CONSTANTS.SEARCH_PLACEHOLDER);
    
    // Simulate typing character by character
    fireEvent.change(searchInput, { target: { value: 'q' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('q');
    
    fireEvent.change(searchInput, { target: { value: 'qu' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('qu');
    
    fireEvent.change(searchInput, { target: { value: 'qur' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('qur');
    
    fireEvent.change(searchInput, { target: { value: 'quran' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('quran');
    
    expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
  });

  it('should be keyboard accessible', () => {
    render(
      <SearchSystem 
        searchQuery=""
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(UI_CONSTANTS.SEARCH_PLACEHOLDER);
    
    // Should be focusable
    searchInput.focus();
    expect(document.activeElement).toBe(searchInput);
  });
});