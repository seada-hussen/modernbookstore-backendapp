import React, { useState, useRef, useEffect } from 'react';
import { AddBookModalProps } from '../types/components';
import { BOOK_CATEGORIES, CreateBookData } from '../types/book';

const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories = BOOK_CATEGORIES
}) => {
  // Form state
  const [formData, setFormData] = useState<CreateBookData>({
    title: '',
    author: '',
    category: categories[0], // Default to first category (Quran)
    price: 0,
    image: ''
  });

  // Form validation state
  const [errors, setErrors] = useState<Partial<Record<keyof CreateBookData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for focus management
  const titleInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        author: '',
        category: categories[0],
        price: 0,
        image: ''
      });
      setErrors({});
      setIsSubmitting(false);
      // Focus title input when modal opens
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen, categories]);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateBookData, string>> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    // Author validation
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    } else if (formData.author.length > 100) {
      newErrors.author = 'Author must be 100 characters or less';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else if (!categories.includes(formData.category as any)) {
      newErrors.category = 'Please select a valid category';
    }

    // Price validation
    if (formData.price === null || formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Price must be 0 or greater';
    } else if (formData.price > 9999.99) {
      newErrors.price = 'Price must be $9,999.99 or less';
    }

    // Image URL validation (optional)
    if (formData.image && formData.image.trim()) {
      const urlPattern = /^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]+$/;
      if (!urlPattern.test(formData.image.trim())) {
        newErrors.image = 'Please enter a valid URL starting with http:// or https://';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up form data
      const cleanedData: CreateBookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        price: Number(formData.price),
        image: formData.image?.trim() || undefined
      };

      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      // Error handling is done by parent component
      console.error('Failed to submit book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof CreateBookData, value: string | number) => {
    setFormData((prev: CreateBookData) => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof CreateBookData, string>>) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md shadow-xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 
              id="modal-title" 
              className="text-xl font-bold text-gray-800"
            >
              Add New Book
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Field */}
          <div>
            <label 
              htmlFor="book-title" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Book Title *
            </label>
            <input
              ref={titleInputRef}
              id="book-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter book title (e.g., Tafsir Ibn Kathir)"
              maxLength={200}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          {/* Author Field */}
          <div>
            <label 
              htmlFor="book-author" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Author *
            </label>
            <input
              id="book-author"
              type="text"
              required
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className={`w-full p-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                errors.author ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter author name (e.g., Ibn Kathir)"
              maxLength={100}
              disabled={isSubmitting}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.author}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label 
              htmlFor="book-category" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="book-category"
              required
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full p-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white ${
                errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label 
              htmlFor="book-price" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Price (USD) *
            </label>
            <input
              id="book-price"
              type="number"
              required
              min="0"
              max="9999.99"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className={`w-full p-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="0.00"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.price}
              </p>
            )}
          </div>

          {/* Image URL Field */}
          <div>
            <label 
              htmlFor="book-image" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Cover Image URL <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              id="book-image"
              type="url"
              value={formData.image || ''}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className={`w-full p-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://example.com/book-cover.jpg"
              disabled={isSubmitting}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.image}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-lg hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;