//src/utils/apiError.js

/**
 * Custom error class for handling API errors.
 *
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @param {string} [stack] - The error stack trace.
 *
 * @class
 * @extends {Error}
 *
 * @description This class is used to create custom error objects that can be used to handle API errors in the errorHandler.js file. It allows for more control over the error response sent back to the client, including the status code, message, and any additional error details. This can be useful for providing more informative error messages to the client and handling different types of errors in a consistent way.
 */
function ApiError(statusCode, message, errors = [], stack) {
  Error.call(this, message);
  this.statusCode = statusCode;
  this.message = message || 'Something went wrong';
  this.success = false;
  this.errors = errors;

  if (stack) {
    this.stack = stack;
  } else {
    Error.captureStackTrace(this, this.constructor);
  }
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

/**
 * Creates a new ApiError instance with the specified status code.
 *
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new instance of ApiError.
 */
ApiError.createError = function (statusCode, message, errors = []) {
  return new ApiError(statusCode, message, errors);
};

/**
 * Creates a bad request error (HTTP 400).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new instance of ApiError.
 */
ApiError.badRequest = function (message, errors = []) {
  return ApiError.createError(400, message, errors);
};

/**
 * Creates a not found error (HTTP 404).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new instance of ApiError.
 */
ApiError.notFound = function (message, errors = []) {
  return ApiError.createError(404, message, errors);
};

/**
 * Creates a forbidden error (HTTP 403).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new instance of ApiError.
 */
ApiError.forbidden = function (message, errors = []) {
  return ApiError.createError(403, message, errors);
};

/**
 * Creates an unauthorized error (HTTP 401).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new instance of ApiError.
 */
ApiError.unauthorized = function (message, errors = []) {
  return ApiError.createError(401, message, errors);
};

/**
 * Creates a conflict error (HTTP 409).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new instance of ApiError.
 */
ApiError.conflict = function (message, errors = []) {
  return ApiError.createError(409, message, errors);
};

/**
 * Creates an internal server error (HTTP 500).
 *
 * @param {string} message - The error message.
 * @param {Array} [errors=[]] - Additional error details.
 * @returns {ApiError} - A new instance of ApiError.
 */
ApiError.internal = function (message, errors = []) {
  return ApiError.createError(500, message, errors);
};

module.exports = ApiError;
