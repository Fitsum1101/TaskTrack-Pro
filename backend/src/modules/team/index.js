const teamController = require("./controllers/teamController");
const teamModel = require("./models/teamModel");
const teamRoutes = require("./routes/teamRoutes");
const teamService = require("./services/teamService");
const teamValidation = require("./validations/teamValidation");

module.exports = {
  teamController,
  teamModel,
  teamRoutes,
  teamService,
  teamValidation,
};
