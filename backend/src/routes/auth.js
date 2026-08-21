const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { validateBody } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validations/userValidation");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication & registration endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or email already exists
 */
router.post("/register", validateBody(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user & get JWT Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful and JWT token generated
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateBody(loginSchema), login);

module.exports = router;