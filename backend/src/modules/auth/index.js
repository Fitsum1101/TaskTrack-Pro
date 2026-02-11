const authController = require("./controllers/authController");
const authModel = require("./models/authModel");
const authRoutes = require("./routes/authRoutes");
const authService = require("./services/authService");
const authValidation = require("./validations/authValidation");

module.exports = {
  authController,
  authModel,
  authRoutes,
  authService,
  authValidation,
};
