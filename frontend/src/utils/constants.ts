// UI Constants and Configuration
export const UI_CONSTANTS = {
  // Layout dimensions
  SIDEBAR_WIDTH: '16rem',        // 256px fixed width
  MAX_CONTENT_WIDTH: '72rem',    // 1152px (6xl)
  MOBILE_BREAKPOINT: '768px',
  
  // Text and placeholders
  SEARCH_PLACEHOLDER: 'Search your library...',
  EMPTY_STATE_MESSAGE: 'No books found',
  APP_TITLE: 'ReadOnce',
  LIBRARY_HEADING: 'My Library',
  
  // UI timing
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  NOTIFICATION_DURATION: 5000,
  
  // Grid system
  GRID_COLUMNS: {
    mobile: 2,
    small: 3,
    medium: 4,
    large: 5,
  },
  
  // Book display
  BOOK_COVER_HEIGHT: '10rem',    // 160px
  BOOK_CARD_PADDING: '1rem',
  SHELF_HEIGHT: '0.75rem',
  
  // Forms
  INPUT_BORDER_RADIUS: '0.5rem',
  BUTTON_BORDER_RADIUS: '0.5rem',
  MODAL_BORDER_RADIUS: '1rem',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  // Book validation
  BOOK_TITLE_MIN_LENGTH: 1,
  BOOK_TITLE_MAX_LENGTH: 200,
  BOOK_AUTHOR_MIN_LENGTH: 1,
  BOOK_AUTHOR_MAX_LENGTH: 100,
  BOOK_PRICE_MIN: 0,
  BOOK_PRICE_MAX: 9999.99,
  
  // User validation
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  
  // Search and filters
  SEARCH_MIN_LENGTH: 1,
  SEARCH_MAX_LENGTH: 100,
} as const;

// Color Palette
export const COLORS = {
  // Primary Colors (Amber)
  PRIMARY_50: '#fffbeb',
  PRIMARY_100: '#fef3c7',
  PRIMARY_700: '#b45309',
  PRIMARY_800: '#92400e',
  PRIMARY_900: '#78350f',
  
  // Neutral Colors
  NEUTRAL_50: '#fafafa',
  NEUTRAL_100: '#f5f5f5',
  NEUTRAL_200: '#e5e5e5',
  NEUTRAL_600: '#525252',
  NEUTRAL_800: '#262626',
  NEUTRAL_900: '#171717',
  
  // Background Colors
  BG_PRIMARY: '#fbf9f4',        // Warm off-white
  BG_SECONDARY: '#f5f1e9',      // Shelf background
  BG_CARD: '#ffffff',           // Card background
  
  // Accent Colors
  ERROR_RED: '#dc2626',
  SUCCESS_GREEN: '#059669',
  WARNING_YELLOW: '#d97706',
  INFO_BLUE: '#2563eb',
} as const;

// Navigation Items Configuration
export const NAVIGATION_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: 'home',
  },
  {
    id: 'community',
    label: 'Community',
    href: '/community',
    icon: 'users',
  },
  {
    id: 'library',
    label: 'Library',
    href: '/books',
    icon: 'book-open',
  },
  {
    id: 'reading',
    label: 'Reading',
    href: '/reading',
    icon: 'bookmark',
  },
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    href: '/vocabulary',
    icon: 'academic-cap',
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    href: '/flashcards',
    icon: 'collection',
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: 'user',
  },
] as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  SM: '640px',      // Mobile landscape
  MD: '768px',      // Tablet
  LG: '1024px',     // Desktop
  XL: '1280px',     // Large desktop
  '2XL': '1536px',  // Extra large
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Connection error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  
  // Authentication errors
  AUTH_EXPIRED: 'Session expired. Please login again.',
  AUTH_INVALID: 'Invalid credentials. Please try again.',
  AUTH_REQUIRED: 'Authentication required. Please login.',
  
  // Validation errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_URL: 'Please enter a valid URL.',
  PRICE_INVALID: 'Please enter a valid price.',
  
  // Book-specific errors
  BOOK_NOT_FOUND: 'Book not found.',
  BOOK_CREATE_FAILED: 'Failed to create book. Please try again.',
  BOOK_UPDATE_FAILED: 'Failed to update book. Please try again.',
  BOOK_DELETE_FAILED: 'Failed to delete book. Please try again.',
  
  // General errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOK_CREATED: 'Book added successfully!',
  BOOK_UPDATED: 'Book updated successfully!',
  BOOK_DELETED: 'Book deleted successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  REGISTRATION_SUCCESS: 'Account created successfully!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebarCollapsed',
  LAST_CATEGORY: 'lastSelectedCategory',
  SEARCH_HISTORY: 'searchHistory',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: false,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_BOOK_REVIEWS: false,
  ENABLE_SOCIAL_FEATURES: false,
  ENABLE_ADVANCED_SEARCH: true,
  ENABLE_BOOK_RECOMMENDATIONS: false,
} as const;

// Pagination Settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

// Animation Presets
export const ANIMATIONS = {
  FADE_IN: 'animate-fadeIn',
  FADE_OUT: 'animate-fadeOut',
  SLIDE_IN_LEFT: 'animate-slideInLeft',
  SLIDE_IN_RIGHT: 'animate-slideInRight',
  BOUNCE: 'animate-bounce',
  PULSE: 'animate-pulse',
} as const;