const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const booksRouter = require("./routes/books");
const authRouter = require("./routes/auth");
const orderRoutes = require('./routes/orders');
const { errorHandler } = require("./utils/errors");
const setupSwagger = require('./swagger');

const app = express();

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 1. Core Security & Body Parser Middlewares
app.use(express.json({ limit: '1mb' }));
setupSwagger(app);
app.use(helmet()); // HTTP headers ደህንነት መጠበቅ እና X-Powered-By መደበቅ
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:4173', credentials: true }));

// 2. Rate Limiting (ከ Routes በፊት)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 ደቂቃ
  max: 100, // በአንድ IP በ15 ደቂቃ ውስጥ እስከ 100 request
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// 3. API Routes
app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);
app.use('/api/orders', orderRoutes);

// 4. Global Error Handler (ሁልጊዜ መጨረሻ ላይ ይሁን)
app.use(errorHandler);

module.exports = app;
