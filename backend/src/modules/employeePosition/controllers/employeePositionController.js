// employeePositionController code
const ApiResponse = require('../../../utils/apiResponse');
const catchAsync = require('../../../utils/catchAsync');
const ApiError = require('../../../utils/apiError');
const positionService = require('../services/employeePositionService');
const { StatusCodes } = require('http-status-codes');

/**
 * Get all positions with pagination and filtering
 */
const getAllPositions = catchAsync(async (req, res) => {
  const filters = {
    search: req.query.search,
    companyId: req.query.companyId,
    is_active: req.query.is_active,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  };

  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await positionService.getAllPositions(filters, pagination);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'Positions retrieved successfully'
      )
    );
});

/**
 * Get position by ID
 */
const getPositionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const position = await positionService.getPositionById(id);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        position,
        'Position retrieved successfully'
      )
    );
});

/**
 * Get positions by company
 */
const getPositionsByCompany = catchAsync(async (req, res) => {
  const { companyId } = req.params;

  const filters = {
    search: req.query.search,
    is_active: req.query.is_active,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  };

  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await positionService.getPositionsByCompany(
    companyId,
    filters,
    pagination
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        'Company positions retrieved successfully'
      )
    );
});

/**
 * Create a new position
 */
const createPosition = catchAsync(async (req, res) => {
  // Check if user has permission to create positions
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can create positions'
    );
  }

  const position = await positionService.createPosition(req.body, req);

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        position,
        'Position created successfully'
      )
    );
});

/**
 * Update position by ID
 */
const updatePosition = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if user has permission to update positions
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can update positions'
    );
  }

  const position = await positionService.updatePosition(id, req.body, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, position, 'Position updated successfully')
    );
});

/**
 * Delete position (soft delete)
 */
const deletePosition = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if user has permission to delete positions
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can delete positions'
    );
  }

  const position = await positionService.deletePosition(id, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        position,
        'Position deactivated successfully'
      )
    );
});

/**
 * Hard delete position (permanent deletion)
 */
const hardDeletePosition = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Only super admins can hard delete
  if (req.user.role_type !== 'SUPER_ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can permanently delete positions'
    );
  }

  const result = await positionService.hardDeletePosition(id, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, 'Position permanently deleted')
    );
});

/**
 * Update position status (activate/deactivate)
 */
const updatePositionStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  // Check if user has permission
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can update position status'
    );
  }

  const position = await positionService.updatePositionStatus(
    id,
    is_active,
    req
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        position,
        `Position ${is_active ? 'activated' : 'deactivated'} successfully`
      )
    );
});

/**
 * Bulk create positions
 */
const bulkCreatePositions = catchAsync(async (req, res) => {
  const { positions } = req.body;

  // Only super admins can perform bulk operations
  if (req.user.role_type !== 'SUPER_ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only super admins can perform bulk operations'
    );
  }

  const results = await positionService.bulkCreatePositions(positions, req);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        results,
        'Bulk position creation completed'
      )
    );
});

/**
 * Get position statistics
 */
const getPositionStats = catchAsync(async (req, res) => {
  // Only admins can view stats
  if (req.user.role_type !== 'SUPER_ADMIN' && req.user.role_type !== 'ADMIN') {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only admins can view position statistics'
    );
  }

  const { companyId } = req.query;

  // If user is admin (not super admin), restrict to their company
  let targetCompanyId = companyId;
  if (req.user.role_type === 'ADMIN' && req.user.companyId) {
    // Admin can only view stats for their own company
    if (companyId && companyId !== req.user.companyId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You can only view statistics for your own company'
      );
    }
    targetCompanyId = req.user.companyId;
  }

  const stats = await positionService.getPositionStats(targetCompanyId);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        stats,
        'Position statistics retrieved successfully'
      )
    );
});

module.exports = {
  // Basic CRUD
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  hardDeletePosition,

  // Specialized queries
  getPositionsByCompany,

  // Status management
  updatePositionStatus,

  // Bulk operations
  bulkCreatePositions,

  // Statistics and utilities
  getPositionStats,
};
