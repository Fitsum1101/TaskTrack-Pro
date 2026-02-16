// companyRoutes code

const router = require("express").Router();
const companyController = require("../controllers/companyController");
const {
  updateCompanyValidation,
  deleteCompanyValidation,
} = require("../validations/companyValidation");

const validate = require("../../../middleware/validatorMiddleware");

const authenticate = require("../../../middleware/authMiddleware");

router.use(authenticate);

router
  .route(":id")
  .put(validate(updateCompanyValidation), companyController.updateCompany)
  .delete(validate(deleteCompanyValidation), companyController.deleteCompany);
