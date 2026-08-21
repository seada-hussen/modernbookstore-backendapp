import React from 'react';
import BookshelfView from './BookshelfView';
import { GroupedBooks } from '../types/book';

/**
 * BookshelfView Component Example
 * 
 * This example demonstrates how to use the BookshelfView component
 * to display books grouped by Islamic categories in a bookshelf-style layout.
 */

// Example book data
const exampleGroupedBooks: GroupedBooks = {
  'Quran': [
    {
      _id: '1',
      title: 'The Noble Quran (English Translation)',
      author: 'Abdullah Yusuf Ali',
      category: 'Quran',
      price: 25.99,
      image: 'https://example.com/quran-cover.jpg'
    },
    {
      _id: '2',
      title: 'Al-Quran Al-Kareem',
      author: 'Muhammad Muhsin Khan',
      category: 'Quran',
      price: 22.50,
    }
  ],
  'Tafsir': [
    {
      _id: '3',
      title: 'Tafsir Ibn Kathir (Abridged)',
      author: 'Ibn Kathir',
      category: 'Tafsir',
      price: 45.50,
    },
    {
      _id: '4',
      title: 'Tafsir Al-Jalalayn',
      author: 'Jalal al-Din al-Mahalli & Jalal al-Din al-Suyuti',
      category: 'Tafsir',
      price: 38.99,
      image: 'https://example.com/jalalayn-cover.jpg'
    }
  ],
  'Hadith': [
    {
      _id: '5',
      title: 'Sahih Al-Bukhari',
      author: 'Imam Muhammad Ibn Ismail Al-Bukhari',
      category: 'Hadith',
      price: 35.00,
      image: 'https://example.com/bukhari-cover.jpg'
    },
    {
      _id: '6',
      title: 'Sahih Muslim',
      author: 'Imam Muslim Ibn Al-Hajjaj',
      category: 'Hadith',
      price: 32.99,
    },
    {
      _id: '7',
      title: 'Riyad us-Saliheen',
      author: 'Imam An-Nawawi',
      category: 'Hadith',
      price: 18.75,
      image: 'https://example.com/riyad-cover.jpg'
    }
  ],
  'Sira': [
    {
      _id: '8',
      title: 'The Sealed Nectar (Ar-Raheeq Al-Makhtum)',
      author: 'Safiur Rahman Mubarakpuri',
      category: 'Sira',
      price: 20.99,
    },
    {
      _id: '9',
      title: 'Muhammad: His Life Based on the Earliest Sources',
      author: 'Martin Lings',
      category: 'Sira',
      price: 24.95,
      image: 'https://example.com/lings-sira-cover.jpg'
    }
  ],
  'Fiqh': [
    {
      _id: '10',
      title: 'Fiqh Us-Sunnah',
      author: 'Sayyid Sabiq',
      category: 'Fiqh',
      price: 29.99,
    }
  ]
};

const BookshelfViewExample: React.FC = () => {
  // Handler for book ordering
  const handleOrderBook = (bookId: string) => {
    console.log(`Ordering book with ID: ${bookId}`);
    // In a real application, this would handle the book ordering process
    alert(`Book ${bookId} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Islamic Library Collection
          </h1>
          <p className="text-gray-600">
            Browse our collection of authentic Islamic books organized by category
          </p>
        </header>

        {/* Example 1: With order functionality */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Interactive Bookshelf (with ordering)
          </h2>
          <BookshelfView 
            groupedBooks={exampleGroupedBooks}
            onOrderBook={handleOrderBook}
          />
        </section>

        {/* Example 2: Read-only display */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Read-only Bookshelf
          </h2>
          <BookshelfView 
            groupedBooks={exampleGroupedBooks}
            // No onOrderBook prop - buttons won't appear
          />
        </section>

        {/* Example 3: Empty state */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Empty Bookshelf
          </h2>
          <BookshelfView 
            groupedBooks={{}}
          />
        </section>

        {/* Example 4: Single category */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hadith Collection Only
          </h2>
          <BookshelfView 
            groupedBooks={{
              'Hadith': exampleGroupedBooks['Hadith'] || []
            }}
            onOrderBook={handleOrderBook}
          />
        </section>
      </div>
    </div>
  );
};

export default BookshelfViewExample;