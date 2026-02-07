/**
 * Wraps an async Express route handler/middleware to automatically catch any errors
 * and forward them to the Express error handler using next().
 *
 * This eliminates the need for try/catch blocks in each controller function
 * and helps maintain clean controller code.
 *
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - The wrapped function that handles errors
 *
 * @example
 * // Using catchAsync in a controller
 * const getUsers = catchAsync(async (req, res, next) => {
 *   const users = await userService.getUsers();
 *   res.status(200).json({ success: true, data: users });
 * });
 */
const catchAsync = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
      // Pass all errors to the next middleware (error handler)
      return next(err);
    });
  };
};

module.exports = catchAsync;
