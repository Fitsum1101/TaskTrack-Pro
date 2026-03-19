const ApiError = require('./apiError');

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, 'Route not found'));
};

const errorHandler = (err, req, res, _next) => {
  // Handle JSON parsing errors
  if (
    err instanceof SyntaxError &&
    err.type === 'entity.parse.failed' &&
    err.status === 400
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      errors: [err.message],
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    err = new ApiError(400, 'Validation error', messages);
  }

  // Handle Mongoose duplicate key errors
  if (err.code && err.code === 11000) {
    err = new ApiError(400, 'Duplicate key error');
  }

  // Handle Mongoose cast errors
  if (err.name === 'CastError') {
    err = new ApiError(404, 'Resource not found');
  }

  // Localization
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || [],
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
