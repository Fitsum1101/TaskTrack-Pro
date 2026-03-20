const router = require('express').Router();
const employeeController = require('../controllers/employeeController');
const employeeValidation = require('../validations/employeeValidation');
const validate = require('../../../middleware/validatorMiddleware');

router
  .route('/')
  .get(employeeController.getAllEmployees)
  .post(
    validate(employeeValidation.createEmployee),
    employeeController.createEmployee
  );

module.exports = router;
