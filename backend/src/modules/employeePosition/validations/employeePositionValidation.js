// employeePositionValidation code
const Joi = require('joi');
const { id } = require('../../../utils/customJoi');

// ==============================
// READ OPERATIONS VALIDATION
// ==============================

const getAllPositions = {
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
      .valid('name', 'createdAt', 'updatedAt', 'is_active')
      .default('createdAt')
      .messages({
        'any.only':
          'Sort by must be one of: name, createdAt, updatedAt, is_active',
      }),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
      'any.only': 'Sort order must be either asc or desc',
    }),

    // Filters
    search: Joi.string().trim().min(2).max(50).allow('').optional().messages({
      'string.min': 'Search term must be at least 2 characters',
      'string.max': 'Search term cannot exceed 50 characters',
    }),
    companyId: id.optional().messages({
      'any.invalid': 'Valid company ID is required',
    }),
    is_active: Joi.boolean().optional().messages({
      'boolean.base': 'is_active must be a boolean value',
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

const getPositionById = {
  params: Joi.object({
    id: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
};

const getPositionsByCompany = {
  params: Joi.object({
    companyId: id.required().messages({
      'any.required': 'Company ID is required',
      'any.invalid': 'Valid company ID is required',
    }),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string()
      .valid('name', 'createdAt', 'updatedAt')
      .default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    search: Joi.string().trim().min(2).max(50).allow('').optional(),
    is_active: Joi.boolean().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  }),
};

const getPositionsByDepartment = {
  params: Joi.object({
    departmentId: id.required().messages({
      'any.required': 'Department ID is required',
      'any.invalid': 'Valid department ID is required',
    }),
  }),
  query: Joi.object({
    is_active: Joi.boolean().optional(),
  }),
};

const getPositionsSelect = {
  query: Joi.object({
    companyId: id.optional().messages({
      'any.invalid': 'Valid company ID is required',
    }),
    is_active: Joi.boolean().optional().default(true),
  }),
};

const getPositionsWithEmployeeCount = {
  params: Joi.object({
    companyId: id.required().messages({
      'any.required': 'Company ID is required',
      'any.invalid': 'Valid company ID is required',
    }),
  }),
};

// ==============================
// CREATE OPERATION VALIDATION
// ==============================

const createPosition = {
  body: Joi.object({
    companyId: id.required().messages({
      'any.required': 'Company ID is required',
      'any.invalid': 'Valid company ID is required',
    }),
    name: Joi.string().trim().min(2).max(100).required().messages({
      'any.required': 'Position name is required',
      'string.empty': 'Position name cannot be empty',
      'string.min': 'Position name must be at least 2 characters',
      'string.max': 'Position name cannot exceed 100 characters',
    }),
    description: Joi.string()
      .trim()
      .max(500)
      .optional()
      .allow(null, '')
      .messages({
        'string.max': 'Description cannot exceed 500 characters',
      }),
    is_active: Joi.boolean().optional().default(true),
  }).required(),
};

// ==============================
// UPDATE OPERATION VALIDATION
// ==============================

const updatePosition = {
  params: Joi.object({
    id: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional().messages({
      'string.min': 'Position name must be at least 2 characters',
      'string.max': 'Position name cannot exceed 100 characters',
    }),
    description: Joi.string()
      .trim()
      .max(500)
      .optional()
      .allow(null, '')
      .messages({
        'string.max': 'Description cannot exceed 500 characters',
      }),
    is_active: Joi.boolean().optional(),
  })
    .min(1)
    .required()
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
};

// ==============================
// DELETE OPERATIONS VALIDATION
// ==============================

const deletePosition = {
  params: Joi.object({
    id: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
};

const hardDeletePosition = {
  params: Joi.object({
    id: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
};

// ==============================
// STATUS MANAGEMENT VALIDATION
// ==============================

const updatePositionStatus = {
  params: Joi.object({
    id: id.required().messages({
      'any.required': 'Position ID is required',
      'any.invalid': 'Valid position ID is required',
    }),
  }),
  body: Joi.object({
    is_active: Joi.boolean().required().messages({
      'any.required': 'is_active status is required',
      'boolean.base': 'is_active must be a boolean value',
    }),
  }).required(),
};

// ==============================
// BULK OPERATIONS VALIDATION
// ==============================

const bulkCreatePositions = {
  body: Joi.object({
    positions: Joi.array()
      .items(
        Joi.object({
          companyId: id.required().messages({
            'any.required': 'Company ID is required for each position',
            'any.invalid': 'Valid company ID is required',
          }),
          name: Joi.string().trim().min(2).max(100).required().messages({
            'any.required': 'Position name is required for each position',
            'string.min': 'Position name must be at least 2 characters',
            'string.max': 'Position name cannot exceed 100 characters',
          }),
          description: Joi.string().trim().max(500).optional().allow(null, ''),
          is_active: Joi.boolean().optional().default(true),
        })
      )
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'At least one position must be provided',
        'array.max': 'Cannot create more than 50 positions at once',
        'array.base': 'Positions must be provided as an array',
        'any.required': 'Positions array is required',
      }),
  }).required(),
};

// ==============================
// STATISTICS VALIDATION
// ==============================

const getPositionStats = {
  query: Joi.object({
    companyId: id.optional().messages({
      'any.invalid': 'Valid company ID is required',
    }),
  }),
};

// ==============================
// UTILITY OPERATIONS VALIDATION
// ==============================

const checkPositionName = {
  query: Joi.object({
    companyId: id.required().messages({
      'any.required': 'Company ID is required',
      'any.invalid': 'Valid company ID is required',
    }),
    name: Joi.string().trim().min(2).max(100).required().messages({
      'any.required': 'Position name is required',
      'string.min': 'Position name must be at least 2 characters',
      'string.max': 'Position name cannot exceed 100 characters',
    }),
  }).required(),
};

const exportPositions = {
  query: Joi.object({
    companyId: id.required().messages({
      'any.required': 'Company ID is required',
      'any.invalid': 'Valid company ID is required',
    }),
    format: Joi.string().valid('json', 'csv').default('json').messages({
      'any.only': 'Format must be either json or csv',
    }),
  }),
};

module.exports = {
  // READ operations
  getAllPositions,
  getPositionById,
  getPositionsByCompany,
  getPositionsByDepartment,
  getPositionsSelect,
  getPositionsWithEmployeeCount,

  // CREATE operation
  createPosition,

  // UPDATE operation
  updatePosition,

  // DELETE operations
  deletePosition,
  hardDeletePosition,

  // Status management
  updatePositionStatus,

  // BULK operations
  bulkCreatePositions,

  // STATISTICS
  getPositionStats,

  // UTILITY operations
  checkPositionName,
  exportPositions,
};
