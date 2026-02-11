const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const { verifyAccessToken } = require("../utils/jwtToken");
const { prisma } = require("../config/db");

/**
 * Extract token from various sources in request
 * @param {Object} req - Express request object
 * @returns {string|null} The extracted token or null if not found
 */
function extractToken(req) {
  return (
    req.cookies?.token ||
    req.headers["authorization"]?.replace("Bearer ", "") ||
    req.headers["x-access-token"] ||
    null
  );
}

/**
 * Authentication middleware.
 * Verifies the JWT token and attaches the user object to the request.
 * Enhanced for permission-based authentication.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<Object>} - Passes control to the next middleware
 */

const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, "access token missing"),
      );
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch user data with properly populated permissions
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "user not found"));
    }

    if (!user.isActive) {
      return next(new ApiError(StatusCodes.FORBIDDEN, "account disabled"));
    }

    // if (user.changedPasswordAfter(decoded.iat)) {
    //   return next(
    //     new ApiError(
    //       StatusCodes.UNAUTHORIZED,
    //       req.t("auth.password_changed_relogin")
    //     )
    //   );
    // }

    req.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "token expired"));
    } else if (err.name === "JsonWebTokenError") {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "invalid token"));
    }

    console.error("Authentication error:", err);
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, "authentication failed"),
    );
  }
};

module.exports = authenticate;
