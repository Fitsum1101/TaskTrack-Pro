const UserController = require("./controllers/UserController");
const UserModel = require("./models/UserModel");
const UserRoutes = require("./routes/UserRoutes");
const UserService = require("./services/UserService");
const UserValidation = require("./validations/UserValidation");

module.exports = {
  UserController,
  UserModel,
  UserRoutes,
  UserService,
  UserValidation,
};
