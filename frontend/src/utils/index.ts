// Central export file for utility functions and constants

// Constants
export {
  UI_CONSTANTS,
  API_CONFIG,
  VALIDATION_RULES,
  COLORS,
  NAVIGATION_ITEMS,
  BREAKPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  FEATURE_FLAGS,
  PAGINATION,
  ANIMATIONS,
} from './constants';

// Validators
export {
  isValidBookCategory,
  isValidEmail,
  isValidUrl,
  isValidPrice,
  validateBookData,
  validateSearchQuery,
  sanitizeString,
  sanitizePrice,
  normalizeCategory,
  getCategoryDisplayName,
} from './validators';

export type {
  ValidationError,
  ValidationResult,
} from './validators';

// Formatters
export {
  formatPrice,
  formatPriceSimple,
  formatBookCount,
  formatCategoryCount,
  truncateText,
  toTitleCase,
  capitalize,
  formatUserRole,
  formatAuthorName,
  formatBookTitle,
  formatDate,
  formatRelativeDate,
  formatBookId,
  formatSearchQuery,
  formatCategorySlug,
  formatCategoryName,
  formatValidationError,
  formatFileSize,
} from './formatters';