const { status } = require('http-status');
const ApiError = require('../utils/apiError');

/**
 * Permission-Based Access Control middleware factory
 * Creates middleware that authorizes users based on their permissions
 *
 * @param {string[]} requiredPermissions - Array of permissions required to access the route
 * @returns {Function} Express middleware function
 */

const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      // Check if user exists (should be set by authMiddleware)
      if (!req.user) {
        return next(new ApiError(status.UNAUTHORIZED, 'Authentication required'));
      }

      // Check if user has permissions
      if (!Array.isArray(req.user.permissions)) {
        return next(new ApiError(status.FORBIDDEN, 'User permissions not defined'));
      }

      // Extract permission names from the permission objects, filtering out any null/undefined
      const userPermissionNames = req.user.permissions
        .filter(p => p && p.name) // Filter out null/undefined permissions
        .map(p => p.name);

      // Check if we have any valid permissions
      if (userPermissionNames.length === 0) {
        return next(new ApiError(status.FORBIDDEN, 'No valid permissions found for user'));
      }

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(p => userPermissionNames.includes(p));
      
      if (!hasAllPermissions) {
        return next(
          new ApiError(
            status.FORBIDDEN,
            `Access denied. Required permissions: ${requiredPermissions.join(', ')}. Your permissions: ${userPermissionNames.join(', ')}`,
            [{ requiredPermissions, userPermissions: userPermissionNames }]
          )
        );
      }

      // User has required permissions
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return next(
        new ApiError(status.INTERNAL_SERVER_ERROR, 'Authorization process failed')
      );
    }
  };
};



module.exports = authorize;
