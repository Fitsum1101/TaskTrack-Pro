// employeePostionAssignemntValidation code
const Joi = require('joi');
const { id } = require('../../../utils/customJoi');

// ==============================
// READ OPERATIONS VALIDATION
// ==============================

const getAllAssignments = {
  query: Joi.object({
    // Pagination
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
    }),
    sortBy: Joi.string()
      .valid('assignedAt', 'createdAt', 'updatedAt')
      .default('assignedAt')
      .messages({
        'any.only': 'Sort by must be one of: assignedAt, createdAt, updatedAt',
      }),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
      'any.only': 'Sort order must be either asc or desc',
    }),

    // Filters
    userId: id.optional().messages({
      'any.invalid': 'Valid user ID is required',
    }),
    positionId: id.optional().messages({
      'any.invalid': 'Valid position ID is required',
    }),
    companyId: id.optional().messages({
      'any.invalid': 'Valid company ID is required',
    }),
    departmentId: id.optional().messages({
      'any.invalid': 'Valid department ID is required',
    }),
    search: Joi.string().trim().min(2).max(50).allow('').optional().messages({
      'string.min': 'Search term must be at least 2 characters',
      'string.max': 'Search term cannot exceed 50 characters',
    }),
    startDate: Joi.date().iso().optional().messages({
      'date.base': 'Start date must be a valid date',
      'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
    }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
      'date.base': 'End date must be a valid date',
      'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
      'date.min': 'End date must be after start date',
    }),
  }),
};

const getAssignmentById = {
  params: Joi.object({
    id: id.required().messages({
      'any.required': 'Assignment ID is required',
      'any.invalid': 'Valid assignment ID is required',
    }),
  }),
};

const getAssignmentsByUser = {
  params: Joi.object({
    userId: id.required().messages({
      'any.required': 'User ID is required',
      'any.invalid': 'Valid user ID is required',
    }),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('assignedAt', 'createdAt').default('assignedAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const getAssignmentsByPosition = {
  params: Joi.object({
    positionId: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('assignedAt', 'createdAt').default('assignedAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const getUserPositions = {
  params: Joi.object({
    userId: id.required().messages({
      'any.required': 'User ID is required',
      'any.invalid': 'Valid user ID is required',
    }),
  }),
};

const checkUserPosition = {
  params: Joi.object({
    userId: id.required().messages({
      'any.required': 'User ID is required',
      'any.invalid': 'Valid user ID is required',
    }),
    positionId: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
};

// ==============================
// CREATE OPERATION VALIDATION
// ==============================

const createAssignment = {
  body: Joi.object({
    userId: id.required().messages({
      'any.required': 'User ID is required',
      'any.invalid': 'Valid user ID is required',
    }),
    positionId: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }).required(),
};

const assignMyself = {
  body: Joi.object({
    positionId: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }).required(),
};

// ==============================
// DELETE OPERATIONS VALIDATION
// ==============================

const deleteAssignment = {
  params: Joi.object({
    id: id.required().messages({
      'any.required': 'Assignment ID is required',
      'any.invalid': 'Valid assignment ID is required',
    }),
  }),
};

const deleteUserAssignments = {
  params: Joi.object({
    userId: id.required().messages({
      'any.required': 'User ID is required',
      'any.invalid': 'Valid user ID is required',
    }),
  }),
};

const deletePositionAssignments = {
  params: Joi.object({
    positionId: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
};

const removeMyself = {
  params: Joi.object({
    positionId: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
};

// ==============================
// BULK OPERATIONS VALIDATION
// ==============================

const bulkCreateAssignments = {
  body: Joi.object({
    assignments: Joi.array()
      .items(
        Joi.object({
          userId: id.required().messages({
            'any.required': 'User ID is required for each assignment',
            'any.invalid': 'Valid user ID is required',
          }),
          positionId: id.required().messages({
            'any.required': 'Position ID is required for each assignment',
            'any.invalid': 'Valid position ID is required',
          }),
        })
      )
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'At least one assignment must be provided',
        'array.max': 'Cannot create more than 50 assignments at once',
        'array.base': 'Assignments must be provided as an array',
        'any.required': 'Assignments array is required',
      }),
  }).required(),
};

// ==============================
// STATISTICS VALIDATION
// ==============================

const getAssignmentStats = {
  query: Joi.object({
    companyId: id.optional().messages({
      'any.invalid': 'Valid company ID is required',
    }),
    departmentId: id.optional().messages({
      'any.invalid': 'Valid department ID is required',
    }),
  }),
};

// ==============================
// SELF-SERVICE OPERATIONS (no additional validation needed)
// ==============================

const getMyPositions = {
  // No validation needed - uses token
};

module.exports = {
  // READ operations
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByUser,
  getAssignmentsByPosition,
  getUserPositions,
  checkUserPosition,

  // CREATE operations
  createAssignment,
  assignMyself,

  // DELETE operations
  deleteAssignment,
  deleteUserAssignments,
  deletePositionAssignments,
  removeMyself,

  // BULK operations
  bulkCreateAssignments,

  // STATISTICS
  getAssignmentStats,

  // SELF-SERVICE
  getMyPositions,
};
