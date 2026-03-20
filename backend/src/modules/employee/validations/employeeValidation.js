// employeeValidation code
// employeeRoutes code
// employeeValidation code
const Joi = require('joi');
const {
  password,
  email,
  phoneNumber,
  url,
} = require('../../../utils/customJoi');

// Employee role types enum (should match your Prisma enum)
const employeeRoleTypes = [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'EMPLOYEE',
  'GUEST',
];

// ==============================
// CREATE OPERATION VALIDATION
// ==============================

const createEmployee = {
  body: Joi.object({
    first_name: Joi.string().trim().min(2).max(50).required().messages({
      'any.required': 'First name is required',
      'string.empty': 'First name cannot be empty',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
    last_name: Joi.string().trim().min(2).max(50).required().messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name cannot be empty',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
    email: email().required().messages({
      'any.required': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
    phone: phoneNumber().optional().allow(null, '').messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
    profile_picture: url().optional().allow(null, '').messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
    role_type: Joi.string()
      .valid(...employeeRoleTypes)
      .default('EMPLOYEE')
      .messages({
        'any.only': `Role type must be one of: ${employeeRoleTypes.join(', ')}`,
      }),
    is_active: Joi.boolean().default(true),
  }).required(),
};

// ==============================
// UPDATE OPERATION VALIDATION
// ==============================

const updateEmployee = {
  body: Joi.object({
    first_name: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
    last_name: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
    phone: phoneNumber().optional().allow(null, '').messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
    profile_picture: url().optional().allow(null, '').messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
    role_type: Joi.string()
      .valid(...employeeRoleTypes)
      .optional()
      .messages({
        'any.only': `Role type must be one of: ${employeeRoleTypes.join(', ')}`,
      }),
  })
    .min(1)
    .required()
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
};

const updateCurrentEmployee = {
  body: Joi.object({
    first_name: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
    last_name: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
    phone: phoneNumber().optional().allow(null, '').messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
    profile_picture: url().optional().allow(null, '').messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
  })
    .min(1)
    .required()
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
};

// ==============================
// DELETE OPERATION VALIDATION
// ==============================

// ==============================
// PASSWORD MANAGEMENT VALIDATION
// ==============================

const updatePassword = {
  body: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: password().required().messages({
      'any.required': 'New password is required',
      'string.pattern.base':
        'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.required': 'Please confirm your new password',
        'any.only': 'Passwords do not match',
      }),
  }).required(),
};

const resetPassword = {
  body: Joi.object({
    newPassword: password().required().messages({
      'any.required': 'New password is required',
      'string.pattern.base':
        'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.required': 'Please confirm the new password',
        'any.only': 'Passwords do not match',
      }),
  }).required(),
};

module.exports = {
  createEmployee,

  updateEmployee,
  updateCurrentEmployee,

  updatePassword,
  resetPassword,
};
