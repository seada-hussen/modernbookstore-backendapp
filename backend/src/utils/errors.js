const AppError = require('./appError');
const logger = require('./logger'); // 1. Logger-ሩ እዚህ ጋር ተጨምሯል

// Controller-ሮች ላይ ለነበረው createError ድጋፍ መስጫ Helper
const createError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 2. ኤረሩን በ logs/error.log ፋይል ውስጥ መመዝገቢያ መስመር
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // 1. Mongoose Invalid ID Error
  if (err.name === 'CastError') {
    err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // 2. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const value = Object.keys(err.keyValue)[0];
    err = new AppError(`Duplicate field value for '${value}'. Please use another value!`, 400);
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    err = new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token. Please log in again!', 401);
  }

  if (err.name === 'TokenExpiredError') {
    err = new AppError('Your token has expired! Please log in again.', 401);
  }

  res.status(err.statusCode).json({
    status: err.status,
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler, createError };