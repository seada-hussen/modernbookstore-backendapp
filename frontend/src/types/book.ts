// Core Book interface compatible with MongoDB documents
export interface Book {
  _id?: string;           // MongoDB ObjectId (optional for new books)
  id?: string | number;   // Alternative ID field (can be string or number)
  title: string;          // Required book title
  author: string;         // Required author name
  category?: string;      // Book category (optional, can be Islamic category or general)
  price: number;          // Book price in USD
  image?: string;         // Optional cover image URL
  stock?: number;         // Stock quantity (backend field)
  available?: boolean;    // Availability status (backend field)
  createdAt?: Date;       // Timestamp (managed by backend)
  updatedAt?: Date;       // Timestamp (managed by backend)
}

// Create book payload for API requests
export interface CreateBookData {
  title: string;
  author: string;
  category?: string;      // Optional category (can be Islamic category or general)
  price: number;
  image?: string;
  stock?: number;         // Optional stock quantity
}

// Update book payload for API requests
export interface UpdateBookData extends Partial<CreateBookData> {}

// Fixed category enumeration for Islamic books
export const BOOK_CATEGORIES = [
  'Quran',    // Holy Quran and related texts
  'Tafsir',   // Quranic interpretation and commentary
  'Hadith',   // Prophetic traditions and sayings
  'Sira',     // Prophetic biography and history
  'Fiqh'      // Islamic jurisprudence and law
] as const;

export type BookCategory = typeof BOOK_CATEGORIES[number];

// Book collection grouping type
export interface GroupedBooks {
  [category: string]: Book[];
}

// Book filtering and search types
export interface BookFilters {
  selectedCategory: string;
  searchQuery: string;
}

// Book count by category
export interface CategoryCounts {
  [category: string]: number;
}

// Enhanced book interface for library interface (with guaranteed category)
export interface LibraryBook extends Book {
  category: BookCategory;  // Required category for library interface
}

// Book display props for UI components
export interface BookDisplayProps {
  book: Book;
  showStock?: boolean;
  showAvailability?: boolean;
  compact?: boolean;
}