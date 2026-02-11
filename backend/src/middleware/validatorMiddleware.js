const Joi = require("joi");
const { status } = require("http-status");
const { pick } = require("lodash");
const ApiError = require("../utils/apiError");

/**
 * Validation middleware factory function
 * Creates a middleware that validates request data against the provided schema
 *
 * @param {Object} schema - Joi validation schema with optional body, params, and query keys
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorDetails = error.details.map((err) => {
      const pathParts = err.path.slice(1);
      const field =
        pathParts.length > 0
          ? pathParts.join(".")
          : err.context?.key || "unknown";

      return {
        field,
        message: err.message.replace(/['"]/g, ""),
        type: err.type,
      };
    });

    const errorMessage = "validation.failed";
    return next(new ApiError(status.BAD_REQUEST, errorMessage, errorDetails));
  }

  Object.keys(value).forEach((key) => {
    if (value[key]) {
      Object.assign(req[key], value[key]);
    }
  });

  return next();
};

module.exports = validate;
