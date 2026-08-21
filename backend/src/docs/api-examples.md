# API Examples

## List books

GET /api/books?category=fiction&page=1&limit=10&sort=-price

## Create a book

POST /api/books
Content-Type: application/json

{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "price": 320,
  "category": "fiction",
  "stock": 10
}

## Update a book

PUT /api/books/1
Content-Type: application/json

{
  "price": 350
}
