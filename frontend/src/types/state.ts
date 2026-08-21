import { Book, GroupedBooks, CreateBookData } from './book';
import { UserProfile } from './user';

// Application state interface
export interface ApplicationState {
  // Book data
  books: Book[];
  filteredBooks: Book[];
  groupedBooks: GroupedBooks;
  
  // Filter and search state
  selectedCategory: string;
  searchQuery: string;
  
  // UI state
  isAddModalOpen: boolean;
  error: string | null;
  loading: boolean;
  
  // User state
  userProfile: UserProfile | null;
  
  // Form state
  addBookForm: CreateBookData & {
    isSubmitting: boolean;
  };
}

// Library state for the enhanced interface
export interface LibraryState {
  books: Book[];
  selectedCategory: string;
  searchQuery: string;
  isAddModalOpen: boolean;
  error: string | null;
  loading: boolean;
  // Add book form state
  newTitle: string;
  newAuthor: string;
  newCategory: string;
  newPrice: string;
  newImage: string;
}

// UI state management
export interface UIState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  activeModal: string | null;
  notifications: Notification[];
}

// Notification interface
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

// Loading state interface
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number;
}

// Error state interface
export interface ErrorState {
  hasError: boolean;
  errorType?: 'network' | 'validation' | 'server' | 'auth';
  message: string;
  details?: any;
  timestamp?: Date;
}