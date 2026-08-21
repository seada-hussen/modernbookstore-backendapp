const {
  listBooks,
  getBookByIdService,
  createBookService,
  updateBookService,
  deleteBookService,
  getBookStatsService,
} = require("../services/bookService");
const { createError } = require("../utils/errors");

async function getAllBooks(req, res, next) {
  try {
    const result = await listBooks(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getBookById(req, res, next) {
  try {
    const book = await getBookByIdService(req.params.id); 
    if (!book) {
      return next(createError("Book not found", 404));
    }
    res.json(book);
  } catch (error) {
    next(error);
  }
}

async function createBook(req, res, next) {
  try {
    const book = await createBookService(req.body);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

async function updateBook(req, res, next) {
  try {
    const updatedBook = await updateBookService(req.params.id, req.body);
    if (!updatedBook) {
      return next(createError("Book not found", 404));
    }
    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
}

async function deleteBook(req, res, next) {
  try {
    const result = await deleteBookService(req.params.id);
    if (result.deletedCount === 0) {
      return next(createError("Book not found", 404));
    }
    res.json({ message: "Book deleted" });
  } catch (error) {
    next(error);
  }
}

async function getBookStats(req, res, next) {
  try {
    const stats = await getBookStatsService();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookStats,
};