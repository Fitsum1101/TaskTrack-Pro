const ApiError = require("./apiError");

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, "common.errors.route_not_found"));
};

const errorHandler = (err, req, res, _next) => {
  // Handle JSON parsing errors
  if (
    err instanceof SyntaxError &&
    err.type === "entity.parse.failed" &&
    err.status === 400
  ) {
    return res.status(400).json({
      success: false,
      message: req?.t
        ? req.t("common.errors.invalid_json")
        : "Invalid JSON payload",
      errors: [err.message],
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    err = new ApiError(400, "common.errors.validation_error", messages);
  }

  // Handle Mongoose duplicate key errors
  if (err.code && err.code === 11000) {
    err = new ApiError(400, "common.errors.duplicate_key");
  }

  // Handle Mongoose cast errors
  if (err.name === "CastError") {
    err = new ApiError(404, "common.errors.resource_not_found");
  }

  // Localization
  const statusCode = err.statusCode || 500;

  const localizedMessage =
    req?.t && typeof err.message === "string"
      ? req.t(err.message)
      : err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message: localizedMessage,
    errors: err.errors || [],
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
