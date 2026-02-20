const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/apiResponse");
const locals = require("../config/locales");

const {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamsByCompany,
  validateTeamExists,
} = require("../services/teamService.js");

/**
 * Create Team
 */

const createTeamController = catchAsync(async (req, res) => {
  const companyId = req.user.companyId;

  const team = await createTeam(companyId, req.body);

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        team,
        locals.team.team_created_successfully,
      ),
    );
});

/**
 * Get Teams (Pagination + Search)
 */

const getTeamsController = catchAsync(async (req, res) => {
  const companyId = req.user.companyId;
  const { page, limit, search, paginate } = req.query;

  const result = await getTeamsByCompany(companyId, {
    page,
    limit,
    search,
    paginate: paginate === "false" ? false : true,
  });

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        locals.team.teams_fetched_successfully,
      ),
    );
});

/**
 * Get Single Team
 */

const getSingleTeamController = catchAsync(async (req, res) => {
  const companyId = req.user.companyId;
  const teamId = Number(req.params.id);

  const team = await validateTeamExists(teamId, companyId);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        team,
        locals.team.team_fetched_successfully,
      ),
    );
});

/**
 * Update Team
 */

const updateTeamController = catchAsync(async (req, res) => {
  const companyId = req.user.companyId;
  const teamId = Number(req.params.id);
  const { name } = req.body;

  const updatedTeam = await updateTeam(teamId, companyId, name);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        updatedTeam,
        locals.team.team_updated_successfully,
      ),
    );
});

/**
 * Delete Team
 */

const deleteTeamController = catchAsync(async (req, res) => {
  const companyId = req.user.companyId;
  const teamId = Number(req.params.id);

  await deleteTeam(teamId, companyId);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        null,
        locals.team.team_deleted_successfully,
      ),
    );
});

module.exports = {
  createTeamController,
  getTeamsController,
  getSingleTeamController,
  updateTeamController,
  deleteTeamController,
};
