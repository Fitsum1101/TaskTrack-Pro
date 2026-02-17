const { StatusCodes } = require("http-status-codes");

const ApiResponse = require("../../../utils/apiResponse");
const catchAsync = require("../../../utils/catchAsync");
const ApiError = require("../../../utils/apiError");

const companyService = require("../services/companyService");

const updateCompany = catchAsync(async (req, res) => {
  const updatedCompany = await companyService.updateCompany(req.body);
  return ApiResponse(
    StatusCodes.OK,
    updatedCompany,
    "resource update sucessfuly",
  );
});

const deleteCompany = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedCompany = await companyService.deleteCompany(id);
  return res.status(StatusCodes.OK).json(
    ApiResponse(
      StatusCodes.OK,
      {
        name: deleteCompany.name,
        id: deletedCompany.id,
      },
      "resource rejected sucessfuly",
    ),
  );
});

module.exports = {
  updateCompany,
  deleteCompany,
};
