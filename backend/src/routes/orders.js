const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order processing & tracking endpoints
 */

// ሁሉም የ Order ኤንድፖይንቶች Authentication ያስፈልጋቸዋል
router.use(authenticateToken);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     book:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request - Validation or stock error
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.post('/', createOrder);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get logged-in user order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 */
router.get('/my-orders', getMyOrders);

module.exports = router;