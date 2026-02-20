// teamRoutes code
const router = require("express").Router();
const teamController = require("../controllers/teamController");
const teamValidation = require("../validations/teamValidation");

const validate = require("../../../middleware/validatorMiddleware");

const authenticate = require("../../../middleware/authMiddleware");
const authorize = require("../../../middleware/authorize");

router.use(authenticate);

router
  .route("/")
  .post(authorize(["ADMIN"]), validate(), teamController.createTeamController)
  .get(teamController.getTeamsController);

module.exports = router;
