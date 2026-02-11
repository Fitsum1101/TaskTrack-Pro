const companyController = require("./controllers/companyController");
const companyModel = require("./models/companyModel");
const companyRoutes = require("./routes/companyRoutes");
const companyService = require("./services/companyService");
const companyValidation = require("./validations/companyValidation");

module.exports = {
  companyController,
  companyModel,
  companyRoutes,
  companyService,
  companyValidation,
};
