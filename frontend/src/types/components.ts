import { Book, BookCategory, GroupedBooks, CategoryCounts, CreateBookData } from './book';
import { UserRole } from './user';

// Enhanced Library Interface Component Props
export interface EnhancedLibraryInterfaceProps {
  // No external props - self-contained component
}

// Sidebar Navigation Component Props
export interface SidebarNavigationProps {
  userRole: UserRole;
  onLogout: () => void;
}

// Navigation item interface
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

// User Profile Section Props
export interface UserProfileSectionProps {
  userRole: UserRole;
  onLogout: () => void;
  className?: string;
}

// Library Header Component Props
export interface LibraryHeaderProps {
  bookCount: number;
  userRole: UserRole;
  onAddBook: () => void;
}

// Search System Component Props
export interface SearchSystemProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

// Category Filters Component Props
export interface CategoryFiltersProps {
  categories: readonly BookCategory[];
  selectedCategory: string;
  bookCounts: CategoryCounts;
  onCategoryChange: (category: string) => void;
}

// Bookshelf View Component Props
export interface BookshelfViewProps {
  groupedBooks: GroupedBooks;
  onOrderBook?: (bookId: string) => void;
}

// Book Spine Component Props
export interface BookSpineProps {
  book: Book;
  onOrder?: (bookId: string) => void;
}

// Add Book Modal Component Props
export interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookData: CreateBookData) => void;
  categories: readonly BookCategory[];
}

// Form field props for reusable input components
export interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  placeholder?: string;
  required?: boolean;
  error?: string;
}

// Select field props
export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  error?: string;
}

// Modal base props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Button component props
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

// Layout component props
export interface PageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorInfo?: string;
}