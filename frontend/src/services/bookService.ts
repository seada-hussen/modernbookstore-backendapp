import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { Book, CreateBookData, UpdateBookData } from '../types/book';
import { ApiErrorResponse, BooksApiResponse } from '../types/api';

// Enhanced API configuration
interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

// Error types for better error handling
export class ApiError extends Error {
  public statusCode?: number;
  public details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  public field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Enhanced Books API Service with robust error handling and flexible response format support
 */
export class BooksService {
  private client;
  private config: ApiConfig;

  constructor(config?: Partial<ApiConfig>) {
    this.config = {
      baseURL: 'http://localhost:4000/api',
      timeout: 10000,
      retries: 3,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors for authentication and error handling
   */
  private setupInterceptors(): void {
    // Request interceptor for authentication token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for unified error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  /**
   * Handle and classify API errors with user-friendly messages
   */
  private handleApiError(error: AxiosError): Error {
    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return new NetworkError('Request timeout. Please try again.');
      }
      return new NetworkError('Unable to connect to server. Please check your connection.');
    }

    const { status, data } = error.response;
    const errorData = data as ApiErrorResponse;
    const message = errorData?.message || 'An unexpected error occurred.';

    switch (status) {
      case 400:
        return new ValidationError(message || 'Invalid request data.');
      case 401:
        // Clear authentication data and redirect
        localStorage.clear();
        window.location.href = '/login';
        return new AuthenticationError('Session expired. Please login again.');
      case 403:
        return new AuthenticationError('Access denied. Insufficient permissions.');
      case 404:
        return new ApiError('Resource not found.', status);
      case 409:
        return new ValidationError(message || 'Conflict with existing data.');
      case 422:
        return new ValidationError(message || 'Validation failed.');
      case 500:
        return new ApiError('Server error. Please try again later.', status);
      default:
        return new ApiError(message || 'An unexpected error occurred.', status);
    }
  }

  /**
   * Normalize different book response formats to consistent Book[] array
   * Handles: direct array, {books: []}, {data: []}
   */
  private normalizeBookResponse(data: any): Book[] {
    // Handle direct array response
    if (Array.isArray(data)) {
      return data;
    }

    // Handle {books: []} format
    if (data && Array.isArray(data.books)) {
      return data.books;
    }

    // Handle {data: []} format
    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    // Handle single book wrapped in object
    if (data && typeof data === 'object' && data.title) {
      return [data];
    }

    // Fallback to empty array for unexpected formats
    console.warn('Unexpected API response format:', data);
    return [];
  }

  /**
   * Retry failed requests with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    maxRetries: number = this.config.retries
  ): Promise<AxiosResponse<T>> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry authentication or validation errors
        if (error instanceof AuthenticationError || error instanceof ValidationError) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff: wait 1s, 2s, 4s between retries
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Fetch all books with robust error handling and format normalization
   */
  async getAllBooks(): Promise<Book[]> {
    try {
      const response = await this.retryRequest(() => this.client.get('/books'));
      return this.normalizeBookResponse(response.data);
    } catch (error) {
      if (error instanceof ApiError || error instanceof NetworkError) {
        throw error;
      }
      throw new ApiError('Failed to fetch books. Please try again.');
    }
  }

  /**
   * Create a new book with validation and automatic refresh
   */
  async createBook(bookData: CreateBookData): Promise<Book> {
    try {
      // Validate required fields client-side
      this.validateBookData(bookData);

      const response = await this.client.post('/books', bookData);
      
      // Normalize single book response
      const book = response.data;
      if (!book || typeof book !== 'object') {
        throw new ApiError('Invalid response from server.');
      }

      return book;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create book. Please try again.');
    }
  }

  /**
   * Update an existing book
   */
  async updateBook(id: string, bookData: UpdateBookData): Promise<Book> {
    try {
      if (!id) {
        throw new ValidationError('Book ID is required for update.');
      }

      const response = await this.client.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update book. Please try again.');
    }
  }

  /**
   * Delete a book
   */
  async deleteBook(id: string): Promise<void> {
    try {
      if (!id) {
        throw new ValidationError('Book ID is required for deletion.');
      }

      await this.client.delete(`/books/${id}`);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to delete book. Please try again.');
    }
  }

  /**
   * Search books with query parameters
   */
  async searchBooks(params: {
    query?: string;
    category?: string;
    author?: string;
    page?: number;
    limit?: number;
  }): Promise<Book[]> {
    try {
      const response = await this.retryRequest(() =>
        this.client.get('/books', { params })
      );
      return this.normalizeBookResponse(response.data);
    } catch (error) {
      if (error instanceof ApiError || error instanceof NetworkError) {
        throw error;
      }
      throw new ApiError('Failed to search books. Please try again.');
    }
  }

  /**
   * Client-side validation for book data
   */
  private validateBookData(bookData: CreateBookData): void {
    const errors: string[] = [];

    if (!bookData.title?.trim()) {
      errors.push('Title is required.');
    } else if (bookData.title.length > 200) {
      errors.push('Title must be less than 200 characters.');
    }

    if (!bookData.author?.trim()) {
      errors.push('Author is required.');
    } else if (bookData.author.length > 100) {
      errors.push('Author name must be less than 100 characters.');
    }

    if (bookData.price === undefined || bookData.price === null) {
      errors.push('Price is required.');
    } else if (bookData.price < 0) {
      errors.push('Price must be a positive number.');
    } else if (bookData.price > 9999.99) {
      errors.push('Price must be less than $10,000.');
    }

    if (bookData.category && !bookData.category.trim()) {
      errors.push('Category cannot be empty if provided.');
    }

    if (bookData.image && !this.isValidUrl(bookData.image)) {
      errors.push('Image must be a valid URL.');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(' '));
    }
  }

  /**
   * Validate URL format
   */
  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if user has admin privileges for operations
   */
  isAdminUser(): boolean {
    const role = localStorage.getItem('role');
    return role === 'admin';
  }

  /**
   * Get current user role from localStorage
   */
  getUserRole(): string {
    return localStorage.getItem('role') || 'user';
  }

  /**
   * Health check for API connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

// Export a singleton instance
export const booksService = new BooksService();

// Export default for backward compatibility
export default booksService;