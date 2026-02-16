// companyValidation code
const Joi = require("joi");
const { id, phoneNumber } = require("../../../utils/customJoi");

const updateCompanyValidation = {
  body: Joi.object()
    .keys({
      // Required
      name: Joi.string().required().min(2).max(100).messages({
        "string.empty": "Company name is required",
        "any.required": "Company name is required",
      }),

      // Optional contact fields
      phone: phoneNumber().messages({
        "string.pattern.base": "Please provide a valid phone number",
      }),

      address: Joi.string().optional().allow(null, "").max(255),

      city: Joi.string().optional().allow(null, "").max(100),
    })
    .required(),
  params: Joi.object().keys({
    id: id.message({
      "any.required": "ID is required in the URL parameters",
    }),
  }),
};

const deleteCompanyValidation = {
  params: Joi.object().keys({
    id: id.message({
      "any.required": "ID is required in the URL parameters",
    }),
  }),
};

module.exports = {
  updateCompanyValidation,
  deleteCompanyValidation,
};
