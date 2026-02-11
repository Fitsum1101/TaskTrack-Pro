const ApiResponse = require("../../../utils/apiResponse");
const catchAsync = require("../../../utils/catchAsync");
const ApiError = require("../../../utils/apiError");
const authService = require("../services/authService");
const { StatusCodes } = require("http-status-codes");

/**
 * Login user with username and password
 */
const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const { accessToken, refreshToken, user } = await authService.login(
    username,
    password,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { accessToken, refreshToken, user },
        req.t("auth.login_successful"),
      ),
    );
});

/**
 * Register a new user
 */
const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        user,
        "auth.user_registered_successfully",
      ),
    );
});

/**
 * Logout user (blacklist refresh token)
 */
const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) await authService.blacklistRefreshToken(refreshToken);

  res.clearCookie("refreshToken");

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, null, req.t("auth.logout_successful")),
    );
});

/**
 * Refresh JWT tokens using refresh token
 */

const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      req.t("auth.refresh_token_required"),
    );

  const {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user,
  } = await authService.refreshTokens(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { accessToken: newAccessToken, user },
        req.t("auth.tokens_refreshed"),
      ),
    );
});

/**
 * Forgot password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { username } = req.body;
  const resetToken = await authService.forgotPassword(username);

  if (process.env.NODE_ENV === "production") {
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          null,
          req.t("auth.reset_instructions_sent"),
        ),
      );
  } else {
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          { resetToken },
          req.t("auth.reset_token_generated"),
        ),
      );
  }
});

/**
 * Reset password
 */
const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      req.t("auth.password_min_length"),
    );
  }

  const { accessToken, refreshToken, user } = await authService.resetPassword(
    token,
    password,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { accessToken, user },
        req.t("auth.password_reset_success"),
      ),
    );
});

/**
 * Change password (while logged in)
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!newPassword || newPassword.length < 6) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      req.t("auth.new_password_min_length"),
    );
  }

  const { accessToken, refreshToken, user } = await authService.updatePassword(
    userId,
    currentPassword,
    newPassword,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { accessToken, user },
        req.t("auth.password_changed_success"),
      ),
    );
});

/**
 * Verify JWT access token
 */
const verifyToken = catchAsync(async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      req.t("auth.no_token_provided"),
    );

  const user = await authService.verifyToken(token);
  if (!user)
    throw new ApiError(StatusCodes.UNAUTHORIZED, req.t("auth.invalid_token"));

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, { user }, req.t("auth.token_valid")));
});

/**
 * Verify password reset token
 */
const verifyResetToken = catchAsync(async (req, res) => {
  const { token } = req.body;
  if (!token)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      req.t("auth.refresh_token_required"),
    );

  const user = await authService.verifyResetToken(token);
  if (!user)
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      req.t("auth.invalid_reset_token"),
    );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { user },
        req.t("auth.reset_token_valid"),
      ),
    );
});

module.exports = {
  login,
  register,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyToken,
  verifyResetToken,
};
