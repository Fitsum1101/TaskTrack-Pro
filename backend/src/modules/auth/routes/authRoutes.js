// routes/authRoutes.js
const router = require("express").Router();
const authController = require("../controllers/authController");
const authValidation = require("../validations/authValidation");

const validate = require("../../../middleware/validatorMiddleware");

const authenticate = require("../../../middleware/authMiddleware");

// ==============================
// PUBLIC ROUTES
// ==============================

// Login
router.post("/login", validate(authValidation.login), authController.login);

// Register (assuming you have a register controller & schema)

router.post(
  "/register",
  validate(authValidation.register),
  authController.register,
);

// Forgot Password
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword,
);

// Reset Password (with token param in URL)
router.post(
  "/reset-password/:token",
  validate(authValidation.resetPassword),
  authController.resetPassword,
);

// Verify Reset Token
router.post(
  "/verify-token",
  validate(authValidation.verifyResetToken),
  authController.verifyResetToken,
);

// ==============================
// PROTECTED ROUTES (require authentication)
// ==============================
router.use(authenticate);

// Logout
router.post("/logout", validate(authValidation.logout), authController.logout);

// Update/Change Password
router.post(
  "/update-password",
  validate(authValidation.changePassword),
  authController.changePassword,
);

// Refresh Token
router.post(
  "/refresh-token",
  validate(authValidation.refreshTokens),
  authController.refreshTokens,
);

module.exports = router;
