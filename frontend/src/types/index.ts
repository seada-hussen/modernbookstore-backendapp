// Central export file for all TypeScript type definitions

// Book types
export type {
  Book,
  CreateBookData,
  UpdateBookData,
  BookCategory,
  GroupedBooks,
  BookFilters,
  CategoryCounts,
  LibraryBook,
  BookDisplayProps,
} from './book';

export { BOOK_CATEGORIES } from './book';

// User types
export type {
  UserRole,
  UserProfile,
  AuthState,
  LoginCredentials,
  RegisterData,
} from './user';

// Component types
export type {
  EnhancedLibraryInterfaceProps,
  SidebarNavigationProps,
  NavigationItem,
  UserProfileSectionProps,
  LibraryHeaderProps,
  SearchSystemProps,
  CategoryFiltersProps,
  BookshelfViewProps,
  BookSpineProps,
  AddBookModalProps,
  FormFieldProps,
  SelectFieldProps,
  ModalProps,
  ButtonProps,
  PageLayoutProps,
  ErrorBoundaryState,
} from './components';

// API types
export type {
  BooksApiResponse,
  ApiResponse,
  ApiErrorResponse,
  ApiConfig,
  HttpMethod,
  PaginationParams,
  BookSearchParams,
} from './api';

export { API_ENDPOINTS } from './api';

// Error types
export type {
  BaseError,
  FormValidationError,
  ValidationResult,
  ErrorHandlingStrategy,
  ErrorSeverity,
  ErrorContext,
  ErrorReport,
} from './errors';

export {
  ApiError,
  NetworkError,
  ValidationError,
  AuthenticationError,
} from './errors';

// State types
export type {
  ApplicationState,
  LibraryState,
  UIState,
  Notification,
  LoadingState,
  ErrorState,
} from './state';