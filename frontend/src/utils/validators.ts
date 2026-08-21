// Validation utilities for the enhanced library interface

import { VALIDATION_RULES } from './constants';
import { BookCategory, BOOK_CATEGORIES, CreateBookData } from '../types';

// Type guards
export const isValidBookCategory = (category: string): category is BookCategory => {
  return BOOK_CATEGORIES.includes(category as BookCategory);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPrice = (price: number): boolean => {
  return price >= VALIDATION_RULES.BOOK_PRICE_MIN && 
         price <= VALIDATION_RULES.BOOK_PRICE_MAX;
};

// Validation functions
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateBookData = (data: Partial<CreateBookData>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (data.title.length < VALIDATION_RULES.BOOK_TITLE_MIN_LENGTH) {
    errors.push({ field: 'title', message: `Title must be at least ${VALIDATION_RULES.BOOK_TITLE_MIN_LENGTH} character` });
  } else if (data.title.length > VALIDATION_RULES.BOOK_TITLE_MAX_LENGTH) {
    errors.push({ field: 'title', message: `Title must be less than ${VALIDATION_RULES.BOOK_TITLE_MAX_LENGTH} characters` });
  }

  // Author validation
  if (!data.author?.trim()) {
    errors.push({ field: 'author', message: 'Author is required' });
  } else if (data.author.length < VALIDATION_RULES.BOOK_AUTHOR_MIN_LENGTH) {
    errors.push({ field: 'author', message: `Author must be at least ${VALIDATION_RULES.BOOK_AUTHOR_MIN_LENGTH} character` });
  } else if (data.author.length > VALIDATION_RULES.BOOK_AUTHOR_MAX_LENGTH) {
    errors.push({ field: 'author', message: `Author must be less than ${VALIDATION_RULES.BOOK_AUTHOR_MAX_LENGTH} characters` });
  }

  // Price validation
  if (data.price === undefined || data.price === null) {
    errors.push({ field: 'price', message: 'Price is required' });
  } else if (!isValidPrice(data.price)) {
    errors.push({ 
      field: 'price', 
      message: `Price must be between $${VALIDATION_RULES.BOOK_PRICE_MIN} and $${VALIDATION_RULES.BOOK_PRICE_MAX}` 
    });
  }

  // Category validation (if provided)
  if (data.category && !isValidBookCategory(data.category)) {
    errors.push({ 
      field: 'category', 
      message: `Category must be one of: ${BOOK_CATEGORIES.join(', ')}` 
    });
  }

  // Image URL validation (if provided)
  if (data.image && data.image.trim() && !isValidUrl(data.image)) {
    errors.push({ field: 'image', message: 'Please enter a valid image URL' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSearchQuery = (query: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (query.length > VALIDATION_RULES.SEARCH_MAX_LENGTH) {
    errors.push({ 
      field: 'search', 
      message: `Search query must be less than ${VALIDATION_RULES.SEARCH_MAX_LENGTH} characters` 
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitization functions
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const sanitizePrice = (price: string | number): number => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return Math.round(numericPrice * 100) / 100; // Round to 2 decimal places
};

// Category helpers
export const normalizeCategory = (category: string): BookCategory | null => {
  const normalized = category.trim();
  const match = BOOK_CATEGORIES.find(
    cat => cat.toLowerCase() === normalized.toLowerCase()
  );
  return match || null;
};

export const getCategoryDisplayName = (category: string): string => {
  const normalized = normalizeCategory(category);
  return normalized || 'General';
};