// Formatting utilities for the enhanced library interface

// Price formatting
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Simple price formatting for display
export const formatPriceSimple = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Book count formatting
export const formatBookCount = (count: number): string => {
  if (count === 0) return '0 books on your shelf';
  if (count === 1) return '1 book on your shelf';
  return `${count} books on your shelf`;
};

// Category count formatting
export const formatCategoryCount = (count: number): string => {
  return `(${count})`;
};

// Text truncation
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

// Title case formatting
export const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format user role for display
export const formatUserRole = (role: string): string => {
  return role.toUpperCase();
};

// Format author name (handle multiple authors)
export const formatAuthorName = (author: string): string => {
  // Handle cases like "Author1, Author2" or "Author1 and Author2"
  if (author.includes(',')) {
    const authors = author.split(',').map(a => a.trim());
    if (authors.length > 2) {
      return `${authors[0]} et al.`;
    }
    return authors.join(' & ');
  }
  
  if (author.includes(' and ')) {
    const authors = author.split(' and ').map(a => a.trim());
    if (authors.length > 2) {
      return `${authors[0]} et al.`;
    }
    return authors.join(' & ');
  }

  return author.trim();
};

// Format book title for display
export const formatBookTitle = (title: string, maxLength?: number): string => {
  const formatted = title.trim();
  return maxLength ? truncateText(formatted, maxLength) : formatted;
};

// Date formatting
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

// Relative date formatting (e.g., "2 days ago")
export const formatRelativeDate = (date: Date | string): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(targetDate);
};

// Format book ID for display (handle both string and number IDs)
export const formatBookId = (id: string | number | undefined): string => {
  if (!id) return 'N/A';
  return String(id);
};

// Format search query for display
export const formatSearchQuery = (query: string): string => {
  return query.trim().toLowerCase();
};

// Format category name for URL/routing
export const formatCategorySlug = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, '-');
};

// Format category name for display
export const formatCategoryName = (category: string): string => {
  if (!category) return 'All';
  return capitalize(category);
};

// Format validation error message
export const formatValidationError = (field: string, message: string): string => {
  return `${capitalize(field)}: ${message}`;
};

// Format file size (for image uploads)
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};