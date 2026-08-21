// Error handling type definitions

// Base error interface
export interface BaseError {
  message: string;
  code?: string;
  timestamp?: Date;
}

// API error class
export class ApiError extends Error {
  public statusCode?: number;
  public details?: any;
  public endpoint?: string;

  constructor(message: string, statusCode?: number, details?: any, endpoint?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.endpoint = endpoint;
  }
}

// Network error class
export class NetworkError extends Error {
  public isOffline: boolean;

  constructor(message: string, isOffline: boolean = false) {
    super(message);
    this.name = 'NetworkError';
    this.isOffline = isOffline;
  }
}

// Validation error class
export class ValidationError extends Error {
  public field?: string;
  public value?: any;

  constructor(message: string, field?: string, value?: any) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

// Authentication error class
export class AuthenticationError extends Error {
  public shouldRedirect: boolean;

  constructor(message: string, shouldRedirect: boolean = true) {
    super(message);
    this.name = 'AuthenticationError';
    this.shouldRedirect = shouldRedirect;
  }
}

// Form validation error interface
export interface FormValidationError {
  field: string;
  message: string;
  code?: string;
}

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// Error handler strategy interface
export interface ErrorHandlingStrategy {
  networkError: {
    display: string;
    fallback: string;
    retry: string;
  };
  authenticationError: {
    action: string;
    message: string;
  };
  validationError: {
    display: string;
    prevent: string;
  };
  serverError: {
    display: string;
    logging: string;
  };
}

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Error context interface
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  timestamp: Date;
}

// Error report interface
export interface ErrorReport {
  error: Error;
  severity: ErrorSeverity;
  context: ErrorContext;
  stackTrace?: string;
  handled: boolean;
}