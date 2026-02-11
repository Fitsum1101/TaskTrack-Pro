// utils/jwtToken.js
const jwt = require("jsonwebtoken");

/**
 * Generate an access token with security best practices
 * @param {Object} user - User object containing authentication info
 * @returns {string} JWT access token
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    isActive: user.isActive,
    role: {
      name: user.role.name,
      id: user.role.id,
    },
    type: "access",

    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    audience: "boss-grand-garment-api",
    issuer: "boss-grand-garment-system",
  });
};

/**
 * Generate a refresh token with security best practices
 * @param {Object} user - User object containing authentication info
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    type: "refresh",
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    audience: "boss-grand-garment-api",
    issuer: "boss-grand-garment-system",
  });
};

/**
 * Verify an access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid
 */
const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    audience: "boss-grand-garment-api",
    issuer: "boss-grand-garment-system",
  });

  if (decoded.type !== "access") {
    throw new Error("Invalid token type");
  }

  return decoded;
};

/**
 * Verify a refresh token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid
 */
const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    audience: "boss-grand-garment-api",
    issuer: "boss-grand-garment-system",
  });

  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  return decoded;
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing both tokens
 */
const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
};
