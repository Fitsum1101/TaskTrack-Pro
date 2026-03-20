const employeePositionController = require('./controllers/employeePositionController');
const employeePositionModel = require('./models/employeePositionModel');
const employeePositionRoutes = require('./routes/employeePositionRoutes');
const employeePositionService = require('./services/employeePositionService');
const employeePositionValidation = require('./validations/employeePositionValidation');

module.exports = {
  employeePositionController,
  employeePositionModel,
  employeePositionRoutes,
  employeePositionService,
  employeePositionValidation,
};
