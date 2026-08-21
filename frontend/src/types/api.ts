import { Book } from './book';

// API Response types for different backend formats
export interface BooksApiResponse {
  data?: Book[];
  books?: Book[];
  // Direct array response also possible as Book[]
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}

// Error response from API
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  details?: any;
}

// Enhanced error handling types
export interface ErrorState {
  hasError: boolean;
  message: string;
  type: 'network' | 'authentication' | 'validation' | 'server' | 'unknown';
  canRetry: boolean;
}

// Retry configuration for failed requests
export interface RetryConfig {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number;
}

// API request configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries?: number;
}

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API endpoint paths
export const API_ENDPOINTS = {
  BOOKS: '/books',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  ORDERS: '/orders',
} as const;

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

// Search and filter parameters for API
export interface BookSearchParams extends PaginationParams {
  category?: string;
  search?: string;
  author?: string;
  title?: string;
}