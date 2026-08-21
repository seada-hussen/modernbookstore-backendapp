const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  getBookStats,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/booksController");
const { validateBody } = require("../middleware/validate");
const { createBookSchema, updateBookSchema } = require("../validations/bookValidation");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management APIs
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books retrieved successfully
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /api/books/stats:
 *   get:
 *     summary: Get book statistics
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get("/stats", getBookStats);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details retrieved
 *       404:
 *         description: Book not found
 */
router.get("/:id", getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Book created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateToken, authorizeRoles("admin"), validateBody(createBookSchema), createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book by ID (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
router.put("/:id", authenticateToken, authorizeRoles("admin"), validateBody(updateBookSchema), updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteBook);

module.exports = router;