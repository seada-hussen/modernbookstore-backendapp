# Production-Ready Bookstore Backend Architecture

## 1. Recommended folder layout

```text
backend/
  src/
    app.js
    server.js
    db.js
    routes/
      books.js
      auth.js
      orders.js
    controllers/
      booksController.js
      authController.js
      ordersController.js
    services/
      bookService.js
      authService.js
      orderService.js
    models/
      User.js
      Book.js
      Order.js
    middleware/
      auth.js
      rbac.js
      rateLimiter.js
      validate.js
    validations/
      authValidation.js
      bookValidation.js
      orderValidation.js
    utils/
      errors.js
      logger.js
    jobs/
      emailJob.js
      receiptJob.js
    config/
      redis.js
      queue.js
```

## 2. Authentication and RBAC boilerplate

```js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

## 3. Checkout transaction example

```js
const mongoose = require('mongoose');

async function placeOrder(orderPayload) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await Book.findOne({ _id: orderPayload.bookId }).session(session);
    if (!book || book.stock < orderPayload.quantity) {
      throw new Error('Insufficient stock');
    }

    book.stock -= orderPayload.quantity;
    await book.save({ session });

    const order = await Order.create([{ ...orderPayload, status: 'Pending' }], { session });
    await session.commitTransaction();
    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

## 4. Production recommendations

- Use Mongoose schemas instead of plain data arrays.
- Add JWT refresh tokens and httpOnly cookies.
- Protect routes with rate limiting and sanitization.
- Add Redis caching for popular catalog endpoints.
- Use BullMQ or similar background workers for email and receipt tasks.
