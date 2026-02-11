// validations/authValidation.js
const Joi = require("joi");
const {
  password,
  username,
  email,
  id,
  phoneNumber,
} = require("../../../utils/customJoi");

const login = {
  body: Joi.object()
    .keys({
      username: username().required().messages({
        "any.required": "Username is required",
        "string.pattern.base":
          "Username can only contain letters, numbers, and underscores",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required",
      }),
    })
    .required(),
};

const register = {
  body: Joi.object()
    .keys({
      firstName: Joi.string().required().messages({
        "any.required": "First name is required",
      }),
      lastName: Joi.string().required().messages({
        "any.required": "Last name is required",
      }),
      username: username().required().messages({
        "any.required": "Username is required",
        "string.pattern.base":
          "Username can only contain letters, numbers, and underscores",
      }),
      email: email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
      }),
      password: password().required().messages({
        "any.required": "Password is required",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      }),
      //  company is mandatory for registration
      company: Joi.string().required().messages({
        "any.required": "Company is required",
      }),
      phone: phoneNumber().required().messages({
        "any.required": "Phone number is required",
      }),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
    })
    .required(),
};

const forgotPassword = {
  body: Joi.object()
    .keys({
      username: username().required().messages({
        "any.required": "Username is required",
      }),
    })
    .required(),
};

const resetPassword = {
  body: Joi.object()
    .keys({
      password: password().required().messages({
        "any.required": "Password is required",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "Passwords do not match",
          "any.required": "Please confirm your password",
        }),
    })
    .required(),
};

const updatePassword = {
  body: Joi.object()
    .keys({
      currentPassword: Joi.string().required().messages({
        "any.required": "Current password is required",
      }),
      newPassword: password().required().messages({
        "any.required": "New password is required",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
          "any.only": "Passwords do not match",
          "any.required": "Please confirm your new password",
        }),
    })
    .required(),
};

const changePassword = {
  body: Joi.object()
    .keys({
      currentPassword: password().required().messages({
        "any.required": "Current password is required",
      }),
      newPassword: password().required().messages({
        "any.required": "New password is required",
      }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
          "any.only": "Passwords do not match",
          "any.required": "Please confirm your new password",
        }),
    })
    .required(),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().optional(),
  }),
};

const logout = {
  body: Joi.object().keys({
    token: Joi.string().optional(),
  }),
};

const verifyResetToken = {
  body: Joi.object().keys({
    token: Joi.string().required().messages({
      "any.required": "Reset token is required",
    }),
  }),
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  updatePassword,
  changePassword,
  refreshTokens,
  logout,
  verifyResetToken,
};
