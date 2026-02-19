// src/modules/auth/services/authService.js
const { status } = require("http-status");

const { prisma } = require("../../../config/db");
const ApiError = require("../../../utils/apiError");
const companyService = require("../../company/services/companyService");
const locals = require("../locales/en.json");

const {
  generateTokens,
  verifyRefreshToken,
  verifyAccessToken,
} = require("../../../utils/jwtToken");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// In-memory blacklist for refresh tokens (replace with Redis/DB in production)
const blacklistedRefreshTokens = new Set();

/**
 * Helper: Check password match
 */
const isPasswordMatch = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

/**
 * Helper: Increment login attempts
 */

const incrementLoginAttempts = async (user) => {
  const maxAttempts = 5;
  let updates = { loginAttempts: { increment: 1 } };
  if ((user.loginAttempts || 0) + 1 >= maxAttempts) {
    updates.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  }
  await prisma.user.update({
    where: { id: user.id },
    data: updates,
  });
};

/**
 * Helper: Reset login attempts
 */

const resetLoginAttempts = async (user) => {
  await prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockUntil: null },
  });
};

/**
 * Helper: Create password reset token
 */
const createPasswordResetToken = async (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: hashedToken, passwordResetExpires: expires },
  });

  return resetToken;
};

/**
 * Helper: Check if password changed after JWT issued
 */
const changedPasswordAfter = (user, JWTTimestamp) => {
  if (!user.passwordChangedAt) return false;
  const changedTimestamp = parseInt(
    user.passwordChangedAt.getTime() / 1000,
    10,
  );
  return JWTTimestamp < changedTimestamp;
};

/**
 * Login user
 */

const login = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user || !user.isActive)
    throw new ApiError(status.FORBIDDEN, locals.auth.incorrect_credentials);

  const match = await isPasswordMatch(user, password);

  //  check if the user is accepted to login or not

  if (user.status === "PENDING") {
    throw new ApiError(status.FORBIDDEN, locals.auth.account_pending);
  }

  if (user.status === "DISABLED") {
    throw new ApiError(status.FORBIDDEN, locals.auth.account_disabled);
  }

  // if (user.lockUntil && new Date() < user.lockUntil) {
  //   throw new ApiError(status.FORBIDDEN, locals.auth.account_locked);
  // }

  if (!match) {
    await incrementLoginAttempts(user);
    throw new ApiError(status.FORBIDDEN, locals.auth.incorrect_credentials);
  }

  await resetLoginAttempts(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const { accessToken, refreshToken } = generateTokens(user);

  return {
    accessToken,
    refreshToken,
    user: { ...user, password: undefined },
  };
};

/**
 * Register user
 */
const register = async (collData) => {
  const companyData = {
    name: collData.company,
    address: collData.address,
    city: collData.city,
    // state: collData.state,
    // zipCode: collData.zipCode,
    phone: collData.phone,
  };

  const userData = {
    firstName: collData.firstName,
    lastName: collData.lastName,
    username: collData.username,
    email: collData.email,
    password: collData.password,
    role: "ADMIN",
  };

  const existingUser = await prisma.user.findUnique({
    where: { username: userData.username.toLowerCase() },
  });

  if (existingUser)
    throw new ApiError(status.CONFLICT, "auth.user_already_exists");

  const company = await companyService.createCompany(companyData);

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const user = await prisma.user.create({
    data: { ...userData, password: hashedPassword, companyId: company.id },
  });

  return await prisma.user.findUnique({
    where: { id: user.id },
  });
};

/**
 * Forgot password
 */
const forgotPassword = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase(), isActive: true },
  });
  if (!user)
    return { message: "If the username exists, a reset link has been sent" };
  return await createPasswordResetToken(user);
};

/**
 * Reset password
 */
const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
      customPermissions: true,
    },
  });

  if (!user)
    throw new ApiError(status.BAD_REQUEST, "Token is invalid or has expired");

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  const rolePermissions =
    user.role?.permissions?.map((p) => p.permission) || [];
  const customPermissions = user.customPermissions || [];
  const permissions = [...new Set([...rolePermissions, ...customPermissions])];

  const { accessToken, refreshToken } = generateTokens(user);

  return {
    accessToken,
    refreshToken,
    user: { ...user, password: undefined, permissions },
  };
};

/**
 * Update password while logged in
 */
const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
      customPermissions: true,
    },
  });

  if (!user) throw new ApiError(status.NOT_FOUND, "User not found");

  const match = await isPasswordMatch(user, currentPassword);
  if (!match)
    throw new ApiError(status.BAD_REQUEST, "auth.incorrect_current_password");

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  const rolePermissions =
    user.role?.permissions?.map((p) => p.permission) || [];
  const customPermissions = user.customPermissions || [];
  const permissions = [...new Set([...rolePermissions, ...customPermissions])];

  const { accessToken, refreshToken } = generateTokens(user);
  return {
    accessToken,
    refreshToken,
    user: { ...user, password: undefined, permissions },
  };
};

/**
 * Refresh access token
 */
const refreshTokens = async (refreshToken) => {
  if (!refreshToken)
    throw new ApiError(status.UNAUTHORIZED, "auth.refresh_token_required");
  if (blacklistedRefreshTokens.has(refreshToken))
    throw new ApiError(status.UNAUTHORIZED, "auth.refresh_token_blacklisted");

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(status.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
      customPermissions: true,
      employee: true,
    },
  });
  if (!user || !user.isActive)
    throw new ApiError(status.UNAUTHORIZED, "auth.invalid_refresh_token");

  const rolePermissions =
    user.role?.permissions?.map((p) => p.permission) || [];
  const customPermissions = user.customPermissions || [];
  const permissions = [...new Set([...rolePermissions, ...customPermissions])];

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    generateTokens(user);
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: { ...user, permissions },
  };
};

/**
 * Blacklist refresh token (logout)
 */
const blacklistToken = async (refreshToken) => {
  blacklistedRefreshTokens.add(refreshToken);
};

/**
 * Verify access token
 */
const verifyToken = async (token) => {
  try {
    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
        customPermissions: true,
        employee: true,
      },
    });
    if (!user || !user.isActive || changedPasswordAfter(user, decoded.iat))
      return null;
    return user;
  } catch {
    return null;
  }
};

/**
 * Verify password reset token
 */
const verifyResetToken = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
  });
  return user || null;
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  updatePassword,
  refreshTokens,
  blacklistRefreshToken: blacklistToken,
  verifyToken,
  verifyResetToken,
};
