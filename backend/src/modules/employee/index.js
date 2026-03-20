const employeeController = require('./controllers/employeeController');
const employeeModel = require('./models/employeeModel');
const employeeRoutes = require('./routes/employeeRoutes');
const employeeService = require('./services/employeeService');
const employeeValidation = require('./validations/employeeValidation');

module.exports = {
  employeeController,
  employeeModel,
  employeeRoutes,
  employeeService,
  employeeValidation,
};
