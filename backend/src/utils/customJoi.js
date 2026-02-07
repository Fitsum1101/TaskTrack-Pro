// utils/customJoi.js
const Joi = require('joi');
const { validate: isUuid } = require('uuid');

// Custom ID validation: UUID only (for Prisma)
const id = Joi.string().custom((value, helpers) => {
  if (!isUuid(value)) {
    return helpers.error('any.invalid', { value });
  }
  return value;
}, 'UUID validation');

// Password validation with complexity requirements
const password = () => {
  return Joi.string()
    .min(6)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .message('Password must contain at least one lowercase letter, one uppercase letter, and one number');
};

// Username validation
const username = () => {
  return Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .message('Username can only contain letters, numbers, and underscores');
};

// Phone number validation (E.164 format)
const phoneNumber = () => {
  return Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .message('Please provide a valid phone number');
};

// Email validation
const email = () => {
  return Joi.string().email().lowercase();
};

module.exports = {
  id,
  password,
  username,
  phoneNumber,
  email
};
